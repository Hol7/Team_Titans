from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.contrib.auth import get_user_model
from .models import Ticket

User = get_user_model()


# 🔹 Mark Arrival
class MarkArrivalView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        today = timezone.now().date()

        # Check if arrival already exists
        if Ticket.objects.filter(user=user, date=today, status=Ticket.PresenceStatus.ARRIVAL).exists():
            return Response({"detail": "Arrival already recorded."}, status=status.HTTP_400_BAD_REQUEST)

        Ticket.objects.create(
            user=user,
            status=Ticket.PresenceStatus.ARRIVAL,
            presence_status=Ticket.PresenceStatus.PRESENT
        )

        return Response({"message": "Arrival successfully recorded."}, status=status.HTTP_201_CREATED)


# 🔹 Mark Departure
class MarkDepartureView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        today = timezone.now().date()

        # Check if an arrival exists
        if not Ticket.objects.filter(user=user, date=today, status=Ticket.PresenceStatus.ARRIVAL).exists():
            return Response({"detail": "No arrival found for today."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if a departure already exists
        if Ticket.objects.filter(user=user, date=today, status=Ticket.PresenceStatus.DEPARTURE).exists():
            return Response({"detail": "Departure already recorded."}, status=status.HTTP_400_BAD_REQUEST)

        Ticket.objects.create(
            user=user,
            status=Ticket.PresenceStatus.DEPARTURE,
            presence_status=Ticket.PresenceStatus.LEFT
        )

        return Response({"message": "Departure successfully recorded."}, status=status.HTTP_201_CREATED)


# 🔹 Get Employee Status
class EmployeeStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()
        data = []

        # If user is a manager -> view everyone
        # Else -> view only their own status
        users = User.objects.all() if request.user.is_staff else [request.user]

        for user in users:
            last_ticket = (
                Ticket.objects.filter(user=user, date=today)
                .order_by("-hour")
                .first()
            )

            if last_ticket:
                status_display = last_ticket.presence_status
                last_update = last_ticket.hour.strftime("%H:%M:%S")
            else:
                status_display = Ticket.PresenceStatus.ABSENT
                last_update = None

            data.append({
                "user": user.email,
                "status": status_display,
                "last_update": last_update,
            })

        return Response(data, status=status.HTTP_200_OK)
