from django.db import models

class AppointmentType(models.Model):

    TYPE_CHOICES = [
        ('Academic', 'Academic'),
        ('Project', 'Project'),
        ('Consultation', 'Consultation'),
    ]

    name = models.CharField(max_length=50, choices=TYPE_CHOICES, unique=True)

    def __str__(self):
        return self.name
