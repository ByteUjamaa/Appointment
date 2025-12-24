from django.contrib import admin
from .models import User, StudentProfile, SupervisorProfile, Availability
from django.contrib.auth.admin import UserAdmin
from .forms import CustomUserCreationForm, CustomUserChangeForm

# Unregister default UserAdmin if already registered
try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = User
    list_display = ('username', 'role', 'first_login','is_staff', 'is_superuser')
    fieldsets = (
        (None, {'fields': ('username', 'password', 'role')}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'role', 'password1', 'password2', 'is_staff', 'is_superuser'),
        }),
    )

admin.site.register(User, CustomUserAdmin)


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "phone", "course", "year_of_study")
    search_fields = ("user__username", "user__first_name", "user__last_name", "course")
    list_filter = ("course", "year_of_study")


@admin.register(SupervisorProfile)
class SupervisorProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "title", "phone")
    search_fields = ("user__username", "user__first_name", "user__last_name", "title")
    list_filter = ("title",)


@admin.register(Availability)
class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ("day",)
    search_fields = ("day",)

