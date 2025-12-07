from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    # Basic Information
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    first_name=models.CharField(max_length=100)
    last_name=models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email=models.EmailField()

    COURSE_CHOICES = [
        ('CSN', 'Computer System and Networks'),
        ('ISM', 'Information Systems Management'),
        ('DS', 'Data Science'),
    ]
    course = models.CharField(max_length=100,choices=COURSE_CHOICES,null=True,blank=False,help_text="Student's course of study (set by admin)")
    YEAR_OF_STUDY_CHOICES = [
        (1, 'First Year'),
        (2, 'Second Year'),
        (3, 'Third Year')
    ]
    year_of_study = models.PositiveSmallIntegerField(choices=YEAR_OF_STUDY_CHOICES,null=True,blank=False,help_text="Student's year of study (set by admin)")
    def __str__(self):
        return f"{self.user.get_full_name()}'s Profile"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.save()