from rest_framework import serializers
from django.contrib.auth import authenticate
from Accounts.models import Students,Supervisor


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




class SupervisorLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            raise serializers.ValidationError("Must include username and password")
        
        # Try to get supervisor
        try:
            supervisor = Supervisor.objects.get(username=username)
        except Supervisor.DoesNotExist:
            raise serializers.ValidationError("Invalid username or password")
        
        # Check if user is active
        if not supervisor.is_active:
            raise serializers.ValidationError("Account is disabled")
        
        # Check password - handle both hashed and plain text
        from django.contrib.auth.hashers import check_password
        password_valid = False
        
        # Check if password is hashed
        if supervisor.password.startswith('pbkdf2_') or supervisor.password.startswith('bcrypt') or supervisor.password.startswith('argon2'):
            password_valid = check_password(password, supervisor.password)
        else:
            # Password might be stored as plain text, do direct comparison
            password_valid = (supervisor.password == password)
        
        if not password_valid:
            raise serializers.ValidationError("Invalid username or password")
                
        data['supervisor'] = supervisor
        return data

class SupervisorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supervisor
        fields = ['id', 'username', 'first_name', 'last_name', 'title', 'role', 'first_login']
        read_only_fields = ['id', 'role', 'first_login']


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