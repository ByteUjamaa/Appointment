from django.contrib import admin
from .models import AppointmentType, Teacher, Appointment, AppointmentResponse

admin.site.register(AppointmentType)
admin.site.register(Teacher)
admin.site.register(Appointment)
admin.site.register(AppointmentResponse)
