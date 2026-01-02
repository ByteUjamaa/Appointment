from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.report_list_create, name='report-list-create'),
    path('<int:pk>/', views.report_detail, name='report-detail'),
    path('<int:pk>/submit/', views.submit_report, name='report-submit'),
    path('<int:pk>/review/', views.review_report, name='report-review'),
    path('<int:pk>/sign/', views.sign_report),
]
