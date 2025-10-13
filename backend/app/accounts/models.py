from django.db import models
from django.contrib.auth.models import AbstractUser

# Models
class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "admin", "admin"
        EMPLOYEE = "employee", "employé"
        MANAGER  = "manager",  "manager"
    
    username = models.CharField(max_length=50, unique=True, blank=False)
    lastName = models.CharField(max_length=200)
    firstName = models.CharField(max_length=200)
    email = models.EmailField(unique=True, blank=False)
    phoneNumber = models.CharField(max_length=15, blank=True)
    role = models.CharField(max_length=15, choices=Role.choices, default=Role.EMPLOYEE)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['lastName', 'email', 'firstName']

    def save(self, *args, **kwargs):
        # Automatically set superusers as admin
        if self.is_superuser:
            self.role = self.Role.ADMIN
        super().save(*args, **kwargs)
