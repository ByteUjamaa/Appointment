from rest_framework import serializers
from .models import AppointmentType, Appointment, AppointmentResponse
from django.conf import settings 

class AppointmentTypeSerializer(serializers.ModelSerializer):
    value = serializers.CharField(source='name', read_only=True)  
    label = serializers.CharField(source='name', read_only=True)  
    class Meta:
        model = AppointmentType
        fields = ['id', 'value', 'label']

# MOVE THIS UP - define it BEFORE AppointmentSerializer
class AppointmentResponseSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.user.first_name", read_only=True)
    supervisor_name = serializers.CharField(source="supervisor.user.first_name", read_only=True)
    class Meta:
        model = AppointmentResponse
        fields = [
            "id", "appointment", "status", "supervisor_comment",
            'confirmed_datetime', "responded_at", "student_name", "supervisor_name",
        ]

class AppointmentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(
        source='student.user.get_first_name', read_only=True
    )
    status_label = serializers.CharField(source='status', read_only=True)
    response = AppointmentResponseSerializer(read_only=True)  # ✅ Now this works!

    class Meta:
        model = Appointment
        fields = [
            'id', 'student', "student_name", 'supervisor', 'appointment_type',
            'date', 'time', 'description', 'status', 'status_label',
            'created_at', 'response'
        ]
        read_only_fields = ['student', 'status', 'created_at']

class AppointmentResponseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentResponse
        fields = ["status", "supervisor_comment", "confirmed_datetime"]

    def create(self, validated_data):
        # These come from view kwargs or manual passing
        appointment = self.context['appointment']
        student = self.context['student']
        supervisor = self.context['supervisor']

        return AppointmentResponse.objects.create(
            appointment=appointment,
            student=student,
            supervisor=supervisor,
            **validated_data
        )