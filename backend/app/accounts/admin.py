from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Custom admin for User model"""
    
    # Fields to display in the admin list view
    list_display = ['email', 'firstName', 'lastName', 'role', 'is_active']
    list_filter = ['role', 'is_active']
    search_fields = ['email', 'firstName', 'lastName']
    ordering = ['lastName', 'firstName']
    
    # Fields for the user detail/edit form
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {
            'fields': ('firstName', 'lastName', 'phoneNumber')
        }),
        ('Permissions', {
            'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Important dates', {
            'fields': ('last_login', 'date_joined'),
            'classes': ('collapse',)
        }),
    )
    
    # Fields for adding a new user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'firstName', 'lastName', 'password1', 'password2', 'role'),
        }),
    )
    
    readonly_fields = ['date_joined', 'last_login']
    
    def get_readonly_fields(self, request, obj=None):
        """Make date_joined and last_login readonly"""
        if obj:  # Editing an existing object
            return self.readonly_fields
        return self.readonly_fields
