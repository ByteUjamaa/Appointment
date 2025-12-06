# Accounts/views.py

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password, check_password

from .models import Students
from .serializer import LoginSerializer, StudentSerializer

from Accounts.models import Students

@api_view(['POST'])
def loginview(request):
    print("LOGIN DATA:", request.data)

    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({"error": "Username and password required"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Manually authenticate against Students model
    try:
        user = Students.objects.get(username=username)
        # Check if password matches (handles hashed passwords)
        if not check_password(password, user.password):
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    except Students.DoesNotExist:
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

    # FIRST LOGIN → must change password
    if user.first_login:
        redirect_path = '/profile'
        message = 'Welcome! Please update your password to continue.'
    else:
        redirect_path = '/student/dashboard'
        message = 'Login successful.'

    return Response({
        "message": message,
        "token": access_token,
        "refresh_token": refresh_token,
        "user": StudentSerializer(user).data,
        "redirect_path": redirect_path,
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_profile_access(request):
    user = request.user

    if user.first_login:
        return Response({
            "authorized": True,
            "message": "You must update your password.",
            "user": StudentSerializer(user).data
        })

    # BLOCK ACCESS
    return Response({
        "authorized": False,
        "message": "You already updated your password. Redirecting...",
        "redirect_path": "/student/dashboard"
    }, status=status.HTTP_403_FORBIDDEN)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    new_password = request.data.get("new_password")

    if not new_password:
        return Response({"error": "Password is required."}, status=400)

    user.password = make_password(new_password)
    user.first_login = False
    user.save()

    return Response({"message": "Password updated successfully!"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_dashboard_access(request):
    user = request.user

    if not user.first_login:
        return Response({
            "authorized": True,
            "dashboard_path": "/student/dashboard",
            "user": StudentSerializer(user).data
        })

    # BLOCK until password changed
    return Response({
        "authorized": False,
        "message": "Update your password first.",
        "redirect_path": "/profile"
    }, status=status.HTTP_403_FORBIDDEN)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    return Response(StudentSerializer(request.user).data)

