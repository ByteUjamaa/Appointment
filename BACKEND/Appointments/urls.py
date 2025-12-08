from django.urls import path
from .views import list_appointment_types,list_teachers,create_appointment,list_appointments,update_appointment_status,appointment_status_count

urlpatterns = [
    path('types/', list_appointment_types, name="appointment-types"),
    path('teachers/', list_teachers, name="list-teachers"),
    path('create/', create_appointment, name="create-appointment"),
    path('', list_appointments, name="list-appointments"),
    path('<int:pk>/update-status/', update_appointment_status, name="update-appointment-status"),
    path('status-count/', appointment_status_count, name="status-count"),

]