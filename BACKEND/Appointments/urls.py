from django.urls import path
from .views import (
    list_appointment_types,
    create_appointment,
    list_appointments,
    update_appointment_status,
    appointment_status_count
)

urlpatterns = [

    path("types/", list_appointment_types),
    path("create/", create_appointment),
    path("", list_appointments),

    path("appointments/<int:pk>/update-status/", update_appointment_status),

    path("appointments/status-count/", appointment_status_count),
]
