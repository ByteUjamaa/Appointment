from django.db import models
from Accounts.models import StudentProfile, SupervisorProfile
from Appointments.models import Appointment
from django.core.exceptions import ValidationError
from django.utils import timezone


class AppointmentReport(models.Model):

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
        ('changes_requested', 'Changes Requested'),
        ('signed', 'Signed'),
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

    supervisor_signature=models.ImageField(
        upload_to="report_signatures/",
        blank=True,
        null=True,
    )

    

    # Business rules
    
    def clean(self):
        if self.appointment.status.lower() != 'accepted':
            raise ValidationError(
                "Report can only be created for accepted appointments."
            )

    def save(self, *args, **kwargs):
        # Enforce validation
        self.full_clean()

        # Auto timestamps
        if self.status == 'submitted' and self.submitted_at is None:
            self.submitted_at = timezone.now()

        if self.status in ['approved', 'requested_changes'] and self.reviewed_at is None:
            self.reviewed_at = timezone.now()

        super().save(*args, **kwargs)

   
    submitted_at = models.DateTimeField(null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    signed_at=models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"Report for Appointment {self.appointment.id}"
