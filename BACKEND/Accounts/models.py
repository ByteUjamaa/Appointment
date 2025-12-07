from django.db import models
from django.contrib.auth.models import AbstractBaseUser

# Create your models here.
class Students(models.Model):
    username=models.CharField(max_length=200, unique=True)
    password=models.CharField(max_length=100)
    first_login=models.BooleanField(default=True)#this will help in validation of whether the students have login for the first time
      

    def __str__(self):
        return self.username
    
