from rest_framework import serializers
from .models import AppointmentReport


class AppointmentReportSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(
        source='student.user.username', read_only=True
    )
    supervisor_name = serializers.CharField(
        source='supervisor.user.username', read_only=True
    )

    class Meta:
        model = AppointmentReport
        fields = [
            'id',
            'appointment',
            'student',
            'student_name',
            'supervisor',
            'supervisor_name',
            'title',
            'content',
            'supervisor_comment',
            'status',
            'submitted_at',
            'reviewed_at',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'student',
            'submitted_at',
            'reviewed_at',
            'created_at',
            'updated_at',
        ]
