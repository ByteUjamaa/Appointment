from django.contrib import admin
from .models import AppointmentType, Appointment,AppointmentResponse

admin.site.register(AppointmentType)
admin.site.register(AppointmentResponse)
admin.site.register(Appointment)

