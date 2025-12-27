from django.db import models
from django.contrib.auth.models import AbstractUser,BaseUserManager
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.validators import RegexValidator


class UserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError("The Username must be set")
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('role', 'admin')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(username, password, **extra_fields)





class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('supervisor', 'Supervisor'),
        ('admin', 'Admin'),
    )

    username = models.CharField(max_length=200, unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    first_login = models.BooleanField(default=True)

    objects = UserManager()  # type: ignore

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.username} ({self.role})"

phone_validator = RegexValidator(
    regex=r'^(0|\+)\d+$',
    message="Phone number must start with 0 or + and contain digits only."
)

class StudentProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )

    phone = models.CharField(max_length=16, null=True, validators=[phone_validator],unique=True)

    COURSE_CHOICES = [
        ('CSN', 'Computer System and Networks'),
        ('ISM', 'Information Systems Management'),
        ('DS', 'Data Science'),
    ]

    course = models.CharField(
        max_length=100,
        choices=COURSE_CHOICES,
        null=True
    )

    YEAR_OF_STUDY_CHOICES = [
        (1, 'First Year'),
        (2, 'Second Year'),
        (3, 'Third Year'),
    ]

    year_of_study = models.PositiveSmallIntegerField(
        choices=YEAR_OF_STUDY_CHOICES,
        null=True
    )

    def __str__(self):
        return f"{self.user.username} Profile"


class Availability(models.Model):
    DAYS_OF_WEEK = [
        ('mon', 'Monday'),
        ('tue', 'Tuesday'),
        ('wed', 'Wednesday'),
        ('thu', 'Thursday'),
        ('fri', 'Friday'),
        ('sat', 'Saturday'),
    ]

    day = models.CharField(max_length=10, choices=DAYS_OF_WEEK, unique=True)

    def __str__(self):
        return self.get_day_display() # type: ignore



class SupervisorProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='supervisor_profile'
    )

    title = models.CharField(max_length=10)
    phone = models.CharField(max_length=16,null=True,validators=[phone_validator],unique=True)

    available_days = models.ManyToManyField(
        Availability,
        blank=True
    )

    def __str__(self):
        return self.user.username





