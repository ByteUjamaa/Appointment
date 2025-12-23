from django.db import models
from Accounts.models import StudentProfile, SupervisorProfile
from Appointments.models import Appointment
from django.core.exceptions import ValidationError


class AppointmentReport(models.Model):

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    appointment = models.OneToOneField(
        Appointment,
        on_delete=models.CASCADE,
        related_name='report'
    )

    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE)
    supervisor = models.ForeignKey(SupervisorProfile, on_delete=models.CASCADE)

    title = models.CharField(max_length=255)
    content = models.TextField()

    supervisor_comment = models.TextField(blank=True, null=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft'
    )

    submitted_at = models.DateTimeField(null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        if self.appointment.status != 'accepted':
            raise ValidationError(
                "Report can only be created for accepted appointments."
            )

    def __str__(self):
        return f"Report for Appointment {self.appointment.id}"
