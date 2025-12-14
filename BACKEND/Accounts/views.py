from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from .models import User, StudentProfile, SupervisorProfile, Availability
from .serializers import (
    StudentProfileSerializer,
    SupervisorProfileSerializer,
    LoginSerializer,
    ChangePasswordSerializer
)


@api_view(['POST'])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data['user']  # type: ignore

    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token) # type: ignore
    refresh_token = str(refresh)

    if user.first_login:
        redirect_path = '/student/profile' if user.role == 'student' else '/supervisor/profile'
    else:
        redirect_path = '/student/dashboard' if user.role == 'student' else '/supervisor/dashboard'

    profile_data = None
    if user.role == 'student':
        if hasattr(user, 'profile'):
            profile_data = StudentProfileSerializer(user.profile).data
    elif user.role == 'supervisor':
        if hasattr(user, 'supervisor_profile'):
            profile_data = SupervisorProfileSerializer(user.supervisor_profile).data

    if profile_data is None:
        # Fallback if profile doesn't exist
        profile_data = {}

    return Response({
        "message": "Login successful",
        "role": user.role,
        "user": profile_data,
        "access_token": access_token,
        "refresh_token": refresh_token,
        "redirect_path": redirect_path
    }, status=200)




@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user

    if user.role == 'student':
        profile = get_object_or_404(StudentProfile, user=user)
        serializer_class = StudentProfileSerializer
    elif user.role == 'supervisor':
        profile = get_object_or_404(SupervisorProfile, user=user)
        serializer_class = SupervisorProfileSerializer
    else:
        return Response({'error': 'Invalid role'}, status=400)

    if request.method == 'GET':
        serializer = serializer_class(profile)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = serializer_class(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)



# Check Profile Access (First Login)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_profile_access(request):
    user = request.user
    if user.first_login:
        return Response({
            "authorized": True,
            "message": "Please complete your profile first."
        }, status=200)
    else:
        redirect_path = '/student/dashboard' if user.role == 'student' else '/supervisor/dashboard'
        return Response({
            "authorized": False,
            "redirect_path": redirect_path
        }, status=403)


# Change Password
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response({"message": "Password updated successfully"})



# List All Supervisors
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_supervisors(request):
    supervisors = User.objects.filter(role='supervisor')
    serializer_data = [SupervisorProfileSerializer(s.supervisor_profile).data for s in supervisors] # type: ignore
    return Response(serializer_data, status=200)



# Create Supervisor (Admin Only)
@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def create_supervisor(request):
    data = request.data.copy()
    data['role'] = 'supervisor'  # enforce role
    serializer = SupervisorProfileSerializer(data=data)
    if serializer.is_valid():
        user = User.objects.create_user(
            username=data['user']['username'],
            password=data['user']['password'],
            first_name=data['user'].get('first_name', ''),
            last_name=data['user'].get('last_name', ''),
            email=data['user'].get('email', ''),
            role='supervisor'
        )
        SupervisorProfile.objects.create(
            user=user,
            title=data.get('title', ''),
            phone=data.get('phone', '')
        )
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)
