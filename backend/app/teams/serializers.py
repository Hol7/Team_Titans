from rest_framework import serializers
from .models import Team
from django.contrib.auth import get_user_model

User = get_user_model()

class TeamSerializer(serializers.ModelSerializer):
    manager_name = serializers.CharField(source='manager.username', read_only=True)
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ['id', 'name', 'manager', 'manager_name', 'member_count', 'members', 'created_at']
        read_only_fields = ['created_at']

    def get_member_count(self, obj):
        return obj.members.count()
