from rest_framework import serializers
from .models import AppointmentType,Appointment, AppointmentResponse
from django.conf import settings 

class AppointmentTypeSerializer(serializers.ModelSerializer):
    value = serializers.CharField(source='name', read_only=True)  
    label = serializers.CharField(source='name', read_only=True)  

    class Meta:
        model = AppointmentType
        fields = ['id', 'value', 'label']





class AppointmentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(
        source='student.user.get_first_name',
        read_only=True
    )
    status_label = serializers.CharField(source='status', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id',
            'student',
            "student_name",
            'supervisor',
            'appointment_type',
            'date',
            'time',
            'description',
            'status',
            'status_label',
            'created_at'
        ]
        read_only_fields = ['student', 'status', 'created_at']


class AppointmentResponseSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.user.first_name", read_only=True)
    supervisor_name = serializers.CharField(source="supervisor.user.first_name", read_only=True)

    class Meta:
        model = AppointmentResponse
        fields = [
            "id",
            "appointment",
            "status",
            "notes",
            "created_at",
            "updated_at",
            "student_name",
            "supervisor_name",
        ]
class AppointmentResponseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentResponse
        fields = ["status", "supervisor_comment"]
