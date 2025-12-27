from django.urls import path
from .views import (
    list_appointment_types,
    create_appointment,
    list_appointments,
    update_appointment_status,
    appointment_status_count,
    dashboard_summary,
    # consultant_stats, consultant_activity, consultant_requests
)

urlpatterns = [
    path("types/", list_appointment_types),
    path("create/", create_appointment),
    path("", list_appointments),
    # These are relative to the /api/appointments/ prefix defined in the project urls
    path("<int:pk>/update-status/", update_appointment_status),
    path("status-count/", appointment_status_count),
    # Dashboard summary used by student/supervisor/admin dashboards
    path("dashboard/summary/", dashboard_summary),
 
]
