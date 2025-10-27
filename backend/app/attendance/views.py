from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.contrib.auth import get_user_model
from .models import Ticket

User = get_user_model()


# 🔹 Mark Arrival
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_arrival(request):
    user = request.user
    today = timezone.now().date()

    if Ticket.objects.filter(user=user, date=today, status=Ticket.PresenceStatus.ARRIVAL).exists():
        return Response({"message": "Arrival already recorded.", "errors": ["Duplicate arrival"]},
                        status=status.HTTP_400_BAD_REQUEST)

    Ticket.objects.create(
        user=user,
        status=Ticket.PresenceStatus.ARRIVAL,
        presence_status=Ticket.PresenceStatus.PRESENT
    )

    return Response({"message": "Arrival successfully recorded."}, status=status.HTTP_201_CREATED)


# 🔹 Mark Departure
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_departure(request):
    user = request.user
    today = timezone.now().date()

    # Must have arrival before departure
    if not Ticket.objects.filter(user=user, date=today, status=Ticket.PresenceStatus.ARRIVAL).exists():
        return Response({"message": "You must mark arrival first."}, status=status.HTTP_400_BAD_REQUEST)

    if Ticket.objects.filter(user=user, date=today, status=Ticket.PresenceStatus.DEPARTURE).exists():
        return Response({"message": "Departure already recorded.", "errors": ["Duplicate departure"]},
                        status=status.HTTP_400_BAD_REQUEST)

    Ticket.objects.create(
        user=user,
        status=Ticket.PresenceStatus.DEPARTURE,
        presence_status=Ticket.PresenceStatus.LEFT
    )

    return Response({"message": "Departure successfully recorded."}, status=status.HTTP_201_CREATED)


# 🔹 Get User Status
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_status(request):
    today = timezone.now().date()
    data = []

    users = User.objects.all() if request.user.is_staff else [request.user]

    for user in users:
        arrival_ticket = Ticket.objects.filter(
            user=user, date=today, status=Ticket.PresenceStatus.ARRIVAL
        ).first()
        departure_ticket = Ticket.objects.filter(
            user=user, date=today, status=Ticket.PresenceStatus.DEPARTURE
        ).first()

        if arrival_ticket and not departure_ticket:
            status_display = Ticket.PresenceStatus.PRESENT
            last_update = arrival_ticket.hour.strftime("%H:%M:%S")
        elif departure_ticket:
            status_display = Ticket.PresenceStatus.LEFT
            last_update = departure_ticket.hour.strftime("%H:%M:%S")
        else:
            status_display = Ticket.PresenceStatus.ABSENT
            last_update = None

        data.append({
            "user": user.email,
            "status": status_display,
            "last_update": last_update,
        })

    return Response(
        {"message": "User status retrieved successfully.", "data": data},
        status=status.HTTP_200_OK
    )
