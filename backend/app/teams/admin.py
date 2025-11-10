from django.contrib import admin
from .models import Team

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    """Admin configuration for Team model"""
    list_display = ('name', 'manager', 'created_at')
    search_fields = ('name', 'manager__username', 'manager__email')
    filter_horizontal = ('members',)
