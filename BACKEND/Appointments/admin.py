from django.contrib import admin
from .models import AppointmentType,Teacher, Appointment


admin.site.register(AppointmentType)
admin.site.register(Teacher)
admin.site.register(Appointment)
