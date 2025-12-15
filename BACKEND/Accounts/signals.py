from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

from .models import User, StudentProfile, SupervisorProfile


@receiver(post_save, sender=User)
def create_role_profile(sender, instance, created, **kwargs):
    if created:
        if instance.role == 'student':
            StudentProfile.objects.get_or_create(user=instance)
        elif instance.role == 'supervisor':
            SupervisorProfile.objects.get_or_create(user=instance)
