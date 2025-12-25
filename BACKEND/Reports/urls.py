from django.urls import path
from . import views

urlpatterns = [
    path('reports/', views.report_list_create, name='report-list-create'),
    path('reports/<int:pk>/', views.report_detail, name='report-detail'),
    path('reports/<int:pk>/submit/', views.submit_report, name='report-submit'),
    path('reports/<int:pk>/review/', views.review_report, name='report-review'),
]
