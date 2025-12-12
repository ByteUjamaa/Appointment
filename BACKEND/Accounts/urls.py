from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    MyTokenObtainPairView,
    profile_view,
    change_password_view,
    loginview,
    create_supervisor,
    list_supervisors,
    
)

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', profile_view, name='profile'),
    path('change-password/', change_password_view, name='change_password'),
    path('create-supervisor/', create_supervisor, name='create-supervisor'),
    path('supervisors/', list_supervisors, name='supervisors-list'),
    path("login/", loginview, name="Portal-login", ),
    
]
