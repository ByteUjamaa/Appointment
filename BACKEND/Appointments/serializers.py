from rest_framework import serializers
from .models import AppointmentType

class AppointmentTypeSerializer(serializers.ModelSerializer):
    value = serializers.CharField(source='name', read_only=True)  
    label = serializers.CharField(source='name', read_only=True)  

    class Meta:
        model = AppointmentType
        fields = ['id', 'value', 'label']