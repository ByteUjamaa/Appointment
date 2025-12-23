from django.urls import path
from .views import (
    report_list_create,
    report_detail,
    submit_report,
    review_report,
)

urlpatterns = [
    path('reports/', report_list_create),
    path('reports/<int:pk>/', report_detail),
    path('reports/<int:pk>/submit/', submit_report),
    path('reports/<int:pk>/review/', review_report),
]
