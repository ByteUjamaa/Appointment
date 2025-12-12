from django.db import models
from django.contrib.auth.models import User

class AppointmentType(models.Model):

    TYPE_CHOICES = [
        ('Academic', 'Academic'),
        ('Project', 'Project'),
        ('Consultation', 'Consultation'),
    ]

    name = models.CharField(max_length=50, choices=TYPE_CHOICES, unique=True)

    def __str__(self):
        return self.name

class Teacher(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )

    specialization = models.CharField(max_length=100)

    def __str__(self):
        return self.user.username
    

class Appointment(models.Model):

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Accepted', 'Accepted'),
        ('Rejected', 'Rejected'),
        ('Completed', 'Completed'),
    ]

    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="appointments"
    )

    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE,
        related_name="appointments"
    )

    appointment_type = models.ForeignKey(
        AppointmentType,
        on_delete=models.CASCADE
    )

    date = models.DateField()
    time = models.TimeField()

    description = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Pending'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.username} -> {self.teacher.user.username}"


class AppointmentResponse(models.Model):    
    appointment = models.OneToOneField(
        Appointment,
        on_delete=models.CASCADE,
        related_name="response"
    )
    
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="appointment_responses"
    )
    
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE,
        related_name="appointment_responses"
    )

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Accepted", "Accepted"),
        ("Rejected", "Rejected"),
        ("Completed", "Completed"),
    ]
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )

    supervisor_comment = models.TextField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Response for {self.appointment} - {self.status}"
