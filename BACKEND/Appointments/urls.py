from django.urls import path
from .views import list_appointment_types

urlpatterns = [
    path('types/', list_appointment_types, name="appointment-types"),
]