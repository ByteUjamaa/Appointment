from django.urls import path
from .views import (
    list_appointment_types,
    list_teachers,
    create_appointment,
    list_appointments,
    update_appointment_status,
    appointment_status_count
)

urlpatterns = [

    path("appointment-types/", list_appointment_types),
    path("teachers/", list_teachers),

    path("appointments/create/", create_appointment),
    path("appointments/", list_appointments),

    path("appointments/<int:pk>/update-status/", update_appointment_status),

    path("appointments/status-count/", appointment_status_count),
]
