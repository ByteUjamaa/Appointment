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
    status_label = serializers.CharField(source='status', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id',
            'student',
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
    class Meta:
        model = AppointmentResponse
        fields = "__all__"
        read_only_fields = ["appointment", "updated_at"]