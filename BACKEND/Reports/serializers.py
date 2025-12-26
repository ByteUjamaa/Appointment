from rest_framework import serializers
from .models import AppointmentReport
from django.utils import timezone


class AppointmentReportCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentReport
        fields = [
            'id',
            'appointment',
            'title',
            'content',
            'status',
            'created_at',
        ]
        read_only_fields = [
            'status',
            'created_at',
        ]

    def validate(self, attrs):
        if self.instance and self.instance.status == 'signed':
            raise serializers.ValidationError("Signed reports cannot be edited.")
        return attrs

    def create(self, validated_data):
        request = self.context['request']

        # Assign student
        validated_data['student'] = request.user.profile

        # Get the Appointment instance
        appointment = validated_data['appointment']
        validated_data['supervisor'] = appointment.supervisor

        return super().create(validated_data)


class AppointmentReportSubmitSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentReport
        fields = ['status']

    def update(self, instance, validated_data):
        instance.status = 'submitted'  # force it
        instance.submitted_at = timezone.now()  # optionally track submission time
        instance.save()
        return instance

class AppointmentReportReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentReport
        fields = [
            'id',
            'supervisor_comment',
            'status',
            'reviewed_at',
        ]
        read_only_fields = [
            'id',
            'reviewed_at',
        ]

    def validate_status(self, value):
        if value not in ['approved', 'changes_requested']:
            raise serializers.ValidationError(
                "status must be approved or changes_requested."
            )
        return value



class AppointmentReportSignatureSerializer(serializers.ModelSerializer):
    class Meta:
        model=AppointmentReport
        fields=['supervisor_signature']

    def validate(self, attrs):
        if self.instance.status !='approved':
            raise serializers.ValidationError(
                'Only approved reports can be signed.'
            )
        return attrs
class AppointmentReportDetailSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(
        source='student.user.get_full_name',
        read_only=True
    )
    supervisor_name = serializers.CharField(
        source='supervisor.user.get_full_name',
        read_only=True
    )

    class Meta:
        model = AppointmentReport
        fields = [
            'id',
            'appointment',
            'student_name',
            'supervisor_name',
            'title',
            'content',
            'supervisor_comment',
            'status',
            'submitted_at',
            'reviewed_at',
            'created_at',
            'signed_ at'
            'supervisor_signature'
        ]
