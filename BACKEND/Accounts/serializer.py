from rest_framework import serializers
from django.contrib.auth import authenticate
from Accounts.models import Students


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
