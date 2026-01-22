from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, StudentProfile, SupervisorProfile, Availability





class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(
            username=attrs.get("username"),
            password=attrs.get("password")
        )

        if not user:
            raise serializers.ValidationError("Invalid username or password")

        attrs["user"] = user
        return attrs



class StudentProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source="user.first_name")
    last_name = serializers.CharField(source="user.last_name")
    email = serializers.EmailField(source="user.email")

    class Meta:
        model = StudentProfile
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "phone",
            "course",
            "year_of_study",
        ]
    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", None)

        # Update User table
        if user_data: 
         for attr, value in user_data.items():
            setattr(instance.user, attr, value)

        instance.user.first_login = False
        instance.user.save()

        # Update StudentProfile table
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance



class SupervisorProfileSerializer(serializers.ModelSerializer):
    available_days = serializers.SerializerMethodField(read_only=True) 
    available_days_input = serializers.SlugRelatedField(
        many=True,
        queryset=Availability.objects.all(),
        slug_field="day",
        write_only=True,
        required=False
    )

    first_name = serializers.CharField(source="user.first_name")
    last_name = serializers.CharField(source="user.last_name")
    email = serializers.EmailField(source="user.email")

    class Meta:
        model = SupervisorProfile
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "title",
            "phone",
            "available_days",
            "available_days_input" 
        ]
    
    def get_available_days(self, obj):
        return [day.get_day_display() for day in obj.available_days.all()]
    
    def update(self, instance, validated_data):
        days_input = validated_data.pop("available_days_input", None)
        if days_input is not None:
            instance.available_days.set(days_input)

        # Update user
        user_data = validated_data.pop("user", {})
        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        instance.user.first_login = False
        instance.user.save()

        # Update profile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField(min_length=8)

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password incorrect")
        return value

    def save(self): # type: ignore
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"]) # type: ignore
        user.save()