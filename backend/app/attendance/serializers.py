# attendance/serializers.py
from rest_framework import serializers
from .models import Ticket, AttendanceQRCode


class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ["id", "user", "date", "hour", "status", "presence_status", "is_late"]
        read_only_fields = ["user", "date", "hour", "presence_status", "is_late"]


class AttendanceQRCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceQRCode
        fields = ["id", "code_id", "generated_by", "created_at", "expires_at", "is_active"]
        read_only_fields = ["id", "generated_by", "created_at", "is_active"]
