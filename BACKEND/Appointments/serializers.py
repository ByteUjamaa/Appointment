from rest_framework import serializers
from .models import AppointmentType

class AppointmentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentType
        fields = ['id', 'name']  
