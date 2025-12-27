from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from django.db.models.signals import post_migrate
from .models import User, StudentProfile, SupervisorProfile, Availability
from django.apps import apps


@receiver(post_save, sender=User)
def create_role_profile(sender, instance, created, **kwargs):
    if created:
        if instance.role == 'student':
            StudentProfile.objects.get_or_create(user=instance)
        elif instance.role == 'supervisor':
            SupervisorProfile.objects.get_or_create(user=instance)

@receiver(post_migrate)
def create_days(sender, **kwargs):
    if sender.name!="Accounts":
        return
    
    Availability=apps.get_model('Accounts', 'Availability')

    DAYS = [
        ('mon', 'Monday'),
        ('tue', 'Tuesday'),
        ('wed', 'Wednesday'),
        ('thu', 'Thursday'),
        ('fri', 'Friday'),
        ('sat', 'Saturday'),
    ]

    for day, _ in DAYS:
        Availability.objects.get_or_create(day=day)
