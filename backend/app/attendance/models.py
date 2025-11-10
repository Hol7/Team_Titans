from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class Ticket(models.Model):
    class PresenceStatus(models.TextChoices):
        ARRIVAL = "arrival", "Arrival"
        DEPARTURE = "departure", "Departure"
        PRESENT = "present", "Present"
        LEFT = "left", "Left"
        ABSENT = "absent", "Absent"

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tickets")
    date = models.DateField(default=timezone.now)
    hour = models.TimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=PresenceStatus.choices)
    presence_status = models.CharField(
        max_length=20,
        choices=PresenceStatus.choices,
        default=PresenceStatus.ABSENT
    )
    is_late = models.BooleanField(default=False)  # 🔹 New field

    class Meta:
        unique_together = ("user", "date", "status")

    def __str__(self):
        return f"{self.user.email} - {self.status} ({self.date})"

# 🔹 Pour tracer les QR Codes générés par le Cyber
class AttendanceQRCode(models.Model):
    code_id = models.CharField(max_length=64, unique=True)
    generated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    def is_valid(self):
        return self.is_active and timezone.now() < self.expires_at

    def __str__(self):
        return f"QR Code {self.code_id} - actif={self.is_active}"