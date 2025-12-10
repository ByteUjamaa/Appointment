
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import update_session_auth_hash
from .models import Profile, Students,Supervisor
from .serializers import ProfileSerializer, ChangePasswordSerializer, LoginSerializer, StudentSerializer,SupervisorSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
        }
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    profile = get_object_or_404(Profile, user=request.user)
    
    if request.method == 'GET':
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
    
    if serializer.is_valid():
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        update_session_auth_hash(request, user)
        return Response({"message": "Password updated successfully"})
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Accounts/views.py



from .models import Students, Supervisor
from .serializers import (
    StudentSerializer,
    SupervisorSerializer,
    SupervisorLoginSerializer,
    SupervisorProfileSerializer
)


#      COMBINED LOGIN (STUDENT + SUPERVISOR)

@api_view(['POST'])
def loginview(request):

    # Fix: handle string body from React
    if isinstance(request.data, str):
        try:
            data = json.loads(request.data)
        except:
            return Response({"error": "Invalid JSON"}, status=400)
    else:
        data = request.data

    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    if not username or not password:
        return Response({"error": "Username and password required"}, status=400)

    
    #              TRY STUDENT LOGIN
    try:
        student = Students.objects.get(username=username)

        # If password is hashed
        if student.password.startswith(('pbkdf2_', 'bcrypt', 'argon2')):
            valid_password = check_password(password, student.password)
        else:
            valid_password = (student.password == password)

        if valid_password:

            # Generate tokens
            try:
                refresh = RefreshToken.for_user(student)
                access_token = str(refresh.access_token)
                refresh_token = str(refresh)
            except:
                import secrets
                access_token = secrets.token_urlsafe(32)
                refresh_token = secrets.token_urlsafe(32)

            # first_login redirect
            if student.first_login:
                redirect_path = "/profile"
            else:
                redirect_path = "/studentDashboard/home"

            return Response({
                "role": "student",
                "message": "Student login successful",
                "token": access_token,
                "refresh_token": refresh_token,
                "user": StudentSerializer(student).data,
                "redirect_path": redirect_path
            }, status=200)

    except Students.DoesNotExist:
        pass  # continue to supervisor login

    
    # TRY SUPERVISOR LOGIN
    
    try:
        supervisor = Supervisor.objects.get(username=username)

        # Plain or hashed password
        if supervisor.password.startswith(("pbkdf2_", "bcrypt", "argon2")):
            valid_password = check_password(password, supervisor.password)
        else:
            valid_password = (supervisor.password == password)

        if not valid_password:
            return Response({"error": "Invalid credentials"}, status=401)

        # Create token (TokenAuth)
        try:
            token, created = Token.objects.get_or_create(user=supervisor)
            token_key = token.key
        except:
            refresh = RefreshToken.for_user(supervisor)
            token_key = str(refresh.access_token)

        redirect_to = "/supervisorDashboard/home"

        return Response({
            "role": "supervisor",
            "message": "Supervisor login successful",
            "token": token_key,
            "user": SupervisorProfileSerializer(supervisor).data,
            "redirect_path": redirect_to
        }, status=200)

    except Supervisor.DoesNotExist:
        pass

    
    # BOTH CHECKS FAILED
    
    return Response({"error": "Invalid login credentials"}, status=400)   


# check student profile access

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_profile_access(request):
    user = request.user

    if user.first_login:
        return Response({
            "authorized": True,
            "message": "You must update your password.",
            "user": StudentSerializer(user).data
        }, status=200)

    return Response({
        "authorized": False,
        "message": "You already updated your password.",
        "redirect_path": "/student/dashboard"
    }, status=403)

# KWAAJILI YA KUTENGENEZA SUPERVISORS
@api_view(['POST'])
# @permission_classes([permissions.IsAdminUser])   
def create_supervisor(request):
    serializer = SupervisorSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
# @permission_classes([permissions.IsAuthenticated])
def list_supervisors(request):
    supervisors = Supervisor.objects.all()
    serializer = SupervisorSerializer(supervisors, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
