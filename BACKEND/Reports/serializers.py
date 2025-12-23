from rest_framework import serializers
from .models import AppointmentReport

class AppointmentReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentReport
        fields = [
            'id',
            'appointment',
            'student',
            'supervisor',
            'title',
            'content',
            'status',
            'created_at',
        ]
        read_only_fields = [
            'student',
            'supervisor',
            'status',
            'created_at',
        ]
