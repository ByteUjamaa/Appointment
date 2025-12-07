from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    ProfileView,
    ChangePasswordView,
    MyTokenObtainPairView,
    RegisterView
)

urlpatterns = [
    # Authentication endpoints
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    
    # Profile management
    path('profile/', ProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
]