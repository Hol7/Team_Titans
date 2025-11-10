from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Custom admin for User model"""
    
    # Fields to display in the admin list view
    list_display = ['email', 'firstName', 'lastName', 'role', 'is_active', 'created_at']
    list_filter = ['role', 'is_active', 'created_at']
    search_fields = ['email', 'firstName', 'lastName', 'username']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
    
    # Fields for the user detail/edit form
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal Info', {
            'fields': ('firstName', 'lastName', 'phoneNumber')
        }),
        ('Permissions', {
            'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Security', {
            'fields': ('last_login_ip', 'failed_login_attempts', 'account_locked_until'),
            'classes': ('collapse',)
        }),
        ('Important dates', {
            'fields': ('last_login', 'date_joined', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    # Fields for adding a new user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'firstName', 'lastName', 'password1', 'password2', 'role'),
        }),
    )
    
    readonly_fields = ['date_joined', 'last_login', 'created_at', 'updated_at', 'last_login_ip', 'failed_login_attempts']
    
    def get_readonly_fields(self, request, obj=None):
        """Make certain fields readonly"""
        if obj:  # Editing an existing object
            return self.readonly_fields
        return ['created_at', 'updated_at']


# Note: Le modèle AuditLog sera enregistré séparément une fois migré depuis middleware.py vers models.py
# Pour l'instant, il est défini dans middleware.py pour des raisons de compatibilité
