from django.urls import path

from .views import consultant_stats, consultant_activity, consultant_requests


urlpatterns = [
    path("stats/", consultant_stats, name="consultant-stats"),
    path("activity/", consultant_activity, name="consultant-activity"),
    path("requests/", consultant_requests, name="consultant-requests"),
]


