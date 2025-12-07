from django.db import models
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
