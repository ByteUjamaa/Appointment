from django.contrib import admin
from . models import Students,Supervisor

# Register your models here.

     



class SupervisorAdmin(admin.ModelAdmin):
    list_display = ("username", "title", "first_name", "last_name", "role", "first_login", "is_active")
    search_fields = ("username", "first_name", "last_name", "title")
    list_filter = ("title", "is_active")


class StudentAdmin(admin.ModelAdmin):
    list_display = ("username", "role", "first_login", "is_active")
    search_fields = ("first_login", "username")
    list_filter = ("is_active", 'first_login')

admin.site.register(Students, StudentAdmin)

admin.site.register(Supervisor, SupervisorAdmin)