from django.urls import path
from .views import (
    loginview,
    change_password,
    check_profile_access,
    check_dashboard_access,
    profile_view,
    create_supervisor,
    list_supervisors
)
urlpatterns = [
    path("login/", loginview, name="student-login"),
    path("change-password/", change_password, name="student-change-password"),
    path("check-profile-access/", check_profile_access, name="check-profile-access"),
    path("check-dashboard-access/", check_dashboard_access, name="check-dashboard-access"),
    path("profile/", profile_view, name="student-profile"),
    path('create-supervisor/', create_supervisor, name='create-supervisor'),
    path('supervisors/', list_supervisors, name='supervisors-list'),
]
