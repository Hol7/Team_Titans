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
