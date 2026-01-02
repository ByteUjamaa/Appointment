from django.contrib import admin
from .models import AppointmentReport

@admin.register(AppointmentReport)
class AppointmentReportAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'appointment',
        'student',
        'supervisor',
        'status',
        'submitted_at',
        'reviewed_at',
        'created_at',
        'updated_at'
    )
    list_filter = ('status', 'submitted_at', 'reviewed_at')
    search_fields = ('title', 'student__user__username', 'supervisor__user__username')
    readonly_fields = ('created_at', 'updated_at', 'submitted_at', 'reviewed_at')
