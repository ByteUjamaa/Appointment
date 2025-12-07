
from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Profile, Students,Supervisor
from django.contrib.auth import authenticate

class ProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    email = serializers.EmailField(source='user.email', required=False)
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Profile
        fields = [
            'id', 'first_name', 'last_name', 'email', 'password',
            'phone', 'course', 'year_of_study'
        ]
        read_only_fields = ['id']

    def update(self, instance, validated_data):
        # Handle user data
        user_data = validated_data.pop('user', {})
        user = instance.user
        
        # Update user fields
        for attr, value in user_data.items():
            setattr(user, attr, value)
        
        # Handle password change if provided
        password = validated_data.pop('password', None)
        if password:
            user.set_password(password)
        
        user.save()

        # Update profile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is not correct")
        return value

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        if not username or not password:
            raise serializers.ValidationError("Username and password required.")

        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError("Invalid login credentials.")

        if not isinstance(user, Students):
            raise serializers.ValidationError("Invalid account type.")

        attrs["user"] = user
        return attrs


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Students
        fields = ['id', 'username', 'first_login']


class UpdatePasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match.")
        return attrs
    


class SupervisorSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Supervisor
        fields = ['id','username', 'password', 'title', 'first_name', 'last_name', 'role', 'first_login']

    def create(self, validated_data):
        password = validated_data.pop('password')
        
        supervisor = Supervisor.objects.model(**validated_data) 
        supervisor.set_password(password) 
        supervisor.save(using=Supervisor.objects._db)
        return supervisor

