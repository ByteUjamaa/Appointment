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

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class StudentManager(BaseUserManager):
    def create_student(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError("Student must have a username")
        student = self.model(username=username, role='student', **extra_fields)
        student.set_password(password)
        student.save(using=self._db)
        return student

class Students(AbstractBaseUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
    ]
    
    username = models.CharField(max_length=200, unique=True) 
    first_login = models.BooleanField(default=True) 
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # Haitakiwi mwanafunzi kuwa na access ya Admin
    objects = StudentManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.username} {self.role}"



class SupervisorManager(BaseUserManager):
    def create_supervisor(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError("Supervisor must have a username")
        supervisor = self.model(username=username, role='supervisor', **extra_fields)
        supervisor.set_password(password)
        supervisor.save(using=self._db)
        return supervisor

class Supervisor(AbstractBaseUser):
    TITLE_CHOICES = [
        ('Mr', 'Mr'),
        ('Mrs', 'Mrs'),
        ('Dr', 'Dr'),
        ('Prof', 'Professor'),
    ]
    
    ROLE_CHOICES = [
        ('supervisor', 'Supervisor'),
    ]
    
    username = models.CharField(max_length=200, unique=True)
    first_login = models.BooleanField(default=True)
    title = models.CharField(max_length=10, choices=TITLE_CHOICES, blank=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='supervisor')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)       #mwalimu hasiwe na access ya admin
  
    objects = SupervisorManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.first_name} {self.last_name} {self.role}"

