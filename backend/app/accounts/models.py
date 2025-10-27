from django.db import models
from django.contrib.auth.models import AbstractUser

# Models
class User(AbstractUser):
    class Role(models.TextChoices):
        # Rôles TMTT selon la politique de sécurité
        GCA = "gca", "GCA"
        CA = "ca", "CA"
        PIRATES = "pirates", "Pirates"
        LUFFY = "luffy", "Luffy"
        KIRA = "kira", "Kira"
        JARVIS = "jarvis", "Jarvis"
    
    username = models.CharField(max_length=50, unique=True, blank=False)
    lastName = models.CharField(max_length=200)
    firstName = models.CharField(max_length=200)
    email = models.EmailField(unique=True, blank=False)
    phoneNumber = models.CharField(max_length=15, blank=True)
    role = models.CharField(max_length=15, choices=Role.choices, default=Role.PIRATES)
    
    # Champs supplémentaires pour la sécurité et l'audit
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    failed_login_attempts = models.IntegerField(default=0)
    account_locked_until = models.DateTimeField(null=True, blank=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['lastName', 'email', 'firstName']
    
    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['username']),
            models.Index(fields=['email']),
            models.Index(fields=['role']),
        ]

    def save(self, *args, **kwargs):
        # Les superusers sont automatiquement GCA
        if self.is_superuser:
            self.role = self.Role.GCA
        super().save(*args, **kwargs)
    
    def has_role(self, *roles):
        """Vérifie si l'utilisateur a l'un des rôles spécifiés"""
        return self.role in roles
    
    def is_gca(self):
        """Vérifie si l'utilisateur est GCA"""
        return self.role == self.Role.GCA or self.is_superuser
    
    def is_ca(self):
        """Vérifie si l'utilisateur est CA"""
        return self.role == self.Role.CA
    
    def is_luffy(self):
        """Vérifie si l'utilisateur est Luffy"""
        return self.role == self.Role.LUFFY
    
    def is_kira(self):
        """Vérifie si l'utilisateur est Kira"""
        return self.role == self.Role.KIRA
    
    def is_jarvis(self):
        """Vérifie si l'utilisateur est Jarvis"""
        return self.role == self.Role.JARVIS
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
