from django.contrib import admin
from pharmapp.users.models import User
from pharmapp.experiments.admin import ExperimentTabularAdmin


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    search_fields = ['first_name', 'last_name', 'username', 'email']
    list_display = ['first_name', 'last_name', 'username', 'email']

    inlines = [ExperimentTabularAdmin,]