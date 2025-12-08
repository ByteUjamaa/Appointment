from django.urls import path
from .views import (
    loginview,
    create_supervisor,
    list_supervisors,
    # supervisor_login
)
urlpatterns = [
    path("login/", loginview, name="Portal-login", ),
    path('create-supervisor/', create_supervisor, name='create-supervisor'),
    path('supervisors/', list_supervisors, name='supervisors-list'),
    
]
