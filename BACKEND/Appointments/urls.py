from django.urls import path
from .views import (
    list_appointment_types,
    list_teachers,
    create_appointment,
    list_appointments,
    update_appointment_status,
    appointment_status_count,
    AppointmentResponseView,
)

urlpatterns = [
    path("appointment-types/", list_appointment_types, name="appointment-types"),
    path("teachers/", list_teachers, name="teachers-list"),
    path("appointments/", list_appointments, name="appointments-list"),
    path("appointments/create/", create_appointment, name="appointment-create"),
    path("appointments/<int:pk>/update-status/", update_appointment_status, name="appointment-update-status"),
    path("appointments/status/count/", appointment_status_count, name="appointment-status-count"),
    path("appointments/<int:appointment_id>/respond/", AppointmentResponseView.as_view(), name="appointment-response"),
]
