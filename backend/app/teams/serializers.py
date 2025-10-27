from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Team

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Serialize basic user info"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class TeamSerializer(serializers.ModelSerializer):
    """Serialize team data with manager and members"""
    manager = UserSerializer(read_only=True)
    members = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = ['id', 'name', 'manager', 'members', 'created_at']
