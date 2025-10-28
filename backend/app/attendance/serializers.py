from rest_framework import serializers
from .models import Ticket

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ["id", "user", "date", "hour", "status", "presence_status", "is_late"]
        read_only_fields = ["user", "date", "hour", "presence_status", "is_late"]
