from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Team(models.Model):
    """Team model linking a manager and multiple members"""
    name = models.CharField(max_length=100, unique=True)
    manager = models.OneToOneField(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_team'
    )
    members = models.ManyToManyField(
        User, related_name='teams', blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
