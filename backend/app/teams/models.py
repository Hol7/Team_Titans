from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.signals import post_migrate
from django.dispatch import receiver

User = get_user_model()

class Team(models.Model):
    """Représente une équipe dans l’entreprise."""
    name = models.CharField(max_length=100, unique=True)
    manager = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="managed_teams"
    )
    members = models.ManyToManyField(User, related_name="teams", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# 🔹 Création automatique des équipes par défaut après migration
@receiver(post_migrate)
def create_default_teams(sender, **kwargs):
    if sender.name == "app.teams":
        default_teams = ["Informatique", "Ressources Humaines", "Marketing", "Comptabilité", "Sécurité"]
        for name in default_teams:
            Team.objects.get_or_create(name=name)
