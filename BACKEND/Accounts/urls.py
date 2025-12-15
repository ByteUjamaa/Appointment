from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from .views import (
    login_view,
    profile_view,
    change_password_view,
    check_profile_access,
    create_supervisor,
    list_supervisors,
)

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/', login_view, name='login'),
    path('profile/', profile_view, name='profile'),
    path('check-profile-access/', check_profile_access, name='check-profile-access'),
    path('change-password/', change_password_view, name='change-password'),
    path('supervisors/', list_supervisors, name='list-supervisors'),
    path('create-supervisor/', create_supervisor, name='create-supervisor'),
]
