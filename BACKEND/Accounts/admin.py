from django.contrib import admin
from . models import Students,Supervisor

# Register your models here.
admin.site.register(Students)



class SupervisorAdmin(admin.ModelAdmin):
    list_display = ("username", "title", "first_name", "last_name", "role", "first_login", "is_active")
    search_fields = ("username", "first_name", "last_name", "title")
    list_filter = ("title", "is_active")


admin.site.register(Supervisor, SupervisorAdmin)