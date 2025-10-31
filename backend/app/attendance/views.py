# attendance/views.py
import qrcode
import io
import uuid
from datetime import timedelta, time
from django.conf import settings
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.http import HttpResponse

from rest_framework.decorators import api_view, permission_classes, renderer_classes
from rest_framework.renderers import BaseRenderer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Ticket, AttendanceQRCode
from .serializers import TicketSerializer

# 🔹 Permissions centralisées
from app.accounts.permissions import CanAccessAttendance, CanGenerateQRCode
from app.accounts.middleware import log_security_event

User = get_user_model()

_late_conf = getattr(settings, "ATTENDANCE_LATE_THRESHOLD", None)
if _late_conf and isinstance(_late_conf, dict):
    LATE_THRESHOLD = time(_late_conf.get("hour", 8), _late_conf.get("minute", 30))
else:
    LATE_THRESHOLD = time(8, 30)


def _now_local():
    return timezone.localtime()


def _today_local():
    return _now_local().date()


# ======================================================
# ===============   POINTAGE CLASSIQUE   ================
# ======================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated, CanAccessAttendance])
def mark_arrival(request):
    user = request.user
    now = _now_local()
    today = now.date()

    if Ticket.objects.filter(user=user, date=today, status=Ticket.PresenceStatus.ARRIVAL).exists():
        try:
            log_security_event(
                user=user,
                action='duplicate_arrival',
                resource_type='Ticket',
                resource_id='',
                details={"date": str(today)},
                success=False,
                ip_address=request.META.get('REMOTE_ADDR', '0.0.0.0')
            )
        except Exception:
            pass
        return Response({"message": "Arrivée déjà enregistrée."}, status=status.HTTP_400_BAD_REQUEST)

    is_late = now.time() > LATE_THRESHOLD
    ticket = Ticket.objects.create(
        user=user,
        date=today,
        status=Ticket.PresenceStatus.ARRIVAL,
        presence_status=Ticket.PresenceStatus.PRESENT,
        is_late=is_late
    )

    try:
        log_security_event(
            user=user,
            action='arrival',
            resource_type='Ticket',
            resource_id=str(ticket.id),
            details={"is_late": is_late, "timestamp": now.isoformat()},
            success=True,
            ip_address=request.META.get('REMOTE_ADDR', '0.0.0.0')
        )
    except Exception:
        pass

    return Response(
        {"message": "Arrivée enregistrée.", "is_late": is_late, "ticket": TicketSerializer(ticket).data},
        status=status.HTTP_201_CREATED
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated, CanAccessAttendance])
def mark_departure(request):
    user = request.user
    today = _today_local()

    if not Ticket.objects.filter(user=user, date=today, status=Ticket.PresenceStatus.ARRIVAL).exists():
        return Response({"message": "Vous devez d'abord enregistrer votre arrivée."},
                        status=status.HTTP_400_BAD_REQUEST)

    if Ticket.objects.filter(user=user, date=today, status=Ticket.PresenceStatus.DEPARTURE).exists():
        return Response({"message": "Départ déjà enregistré."}, status=status.HTTP_400_BAD_REQUEST)

    ticket = Ticket.objects.create(
        user=user,
        date=today,
        status=Ticket.PresenceStatus.DEPARTURE,
        presence_status=Ticket.PresenceStatus.LEFT
    )

    try:
        log_security_event(
            user=user,
            action='departure',
            resource_type='Ticket',
            resource_id=str(ticket.id),
            details={"timestamp": timezone.localtime().isoformat()},
            success=True,
            ip_address=request.META.get('REMOTE_ADDR', '0.0.0.0')
        )
    except Exception:
        pass

    return Response({"message": "Départ enregistré avec succès.", "ticket": TicketSerializer(ticket).data},
                    status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated, CanAccessAttendance])
def employee_status(request):
    today = _today_local()
    user = request.user
    data = []

    if user.is_ca():
        users_qs = User.objects.all()
    elif user.is_luffy():
        team_attr = getattr(user, "team", None)
        if team_attr is None:
            users_qs = User.objects.filter(id=user.id)
        else:
            try:
                users_qs = User.objects.filter(team=team_attr)
            except Exception:
                users_qs = User.objects.filter(id=user.id)
    else:
        users_qs = User.objects.filter(id=user.id)

    for employee in users_qs:
        arrival_ticket = Ticket.objects.filter(
            user=employee, date=today, status=Ticket.PresenceStatus.ARRIVAL
        ).order_by("-hour").first()
        departure_ticket = Ticket.objects.filter(
            user=employee, date=today, status=Ticket.PresenceStatus.DEPARTURE
        ).order_by("-hour").first()

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
            "user": employee.email,
            "status": status_display,
            "last_update": last_update,
            "is_late": bool(arrival_ticket.is_late) if arrival_ticket and hasattr(arrival_ticket, "is_late") else False
        })

    return Response({"message": "Statut des utilisateurs récupéré avec succès.", "data": data},
                    status=status.HTTP_200_OK)


# ======================================================
# ===============   QR CODE MANAGEMENT   ===============
# ======================================================
class PNGRenderer(BaseRenderer):
    media_type = 'image/png'
    format = 'png'

    def render(self, data, accepted_media_type=None, renderer_context=None):
        return data

@api_view(['GET'])
@permission_classes([IsAuthenticated, CanGenerateQRCode])
@renderer_classes([PNGRenderer])
def generate_qr_code(request):
    """Génère un QR code (image PNG) pour le pointage"""
    user = request.user
    now = timezone.now()

    code_id = str(uuid.uuid4())
    expires_at = now + timedelta(minutes=15)

    AttendanceQRCode.objects.create(
        code_id=code_id,
        generated_by=user,
        expires_at=expires_at,
        is_active=True
    )
    print("✅ QR Code généré :", code_id)

    qr_payload = {
        "code_id": code_id,
        "type": "attendance_qr",
        "endpoint": f"{getattr(settings, 'BACKEND_URL', 'http://localhost:8000')}/api/v1/scan"
    }

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(qr_payload)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)

    try:
        log_security_event(
            user=user,
            action='generate_qr_code',
            resource_type='AttendanceQRCode',
            resource_id=code_id,
            details={"expires_at": expires_at.isoformat()},
            success=True,
            ip_address=request.META.get('REMOTE_ADDR', '0.0.0.0')
        )
    except Exception:
        pass


    response = HttpResponse(buffer.getvalue(), content_type="image/png")
    response["Content-Disposition"] = f'inline; filename=\"attendance_qr_{code_id}.png\"'
    return response


@api_view(['POST'])
@permission_classes([IsAuthenticated, CanAccessAttendance])
def scan_qr_code(request):
    user = request.user
    code_id = request.data.get("code_id")
    action = request.data.get("action")

    if not code_id or action not in ["arrival", "departure"]:
        return Response({"message": "Paramètres invalides."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        qr_entry = AttendanceQRCode.objects.get(code_id=code_id)
    except AttendanceQRCode.DoesNotExist:
        return Response({"message": "QR Code invalide."}, status=status.HTTP_404_NOT_FOUND)

    if not qr_entry.is_valid():
        return Response({"message": "QR Code expiré ou désactivé."}, status=status.HTTP_403_FORBIDDEN)

    now = timezone.localtime()
    today = now.date()

    if action == "arrival":
        if Ticket.objects.filter(user=user, date=today, status=Ticket.PresenceStatus.ARRIVAL).exists():
            return Response({"message": "Arrivée déjà enregistrée."}, status=status.HTTP_400_BAD_REQUEST)

        is_late = now.time() > LATE_THRESHOLD
        ticket = Ticket.objects.create(
            user=user,
            date=today,
            status=Ticket.PresenceStatus.ARRIVAL,
            presence_status=Ticket.PresenceStatus.PRESENT,
            is_late=is_late
        )
        msg = "Arrivée enregistrée (en retard)" if is_late else "Arrivée enregistrée à l'heure."

    else:
        if not Ticket.objects.filter(user=user, date=today, status=Ticket.PresenceStatus.ARRIVAL).exists():
            return Response({"message": "Vous devez d'abord enregistrer votre arrivée."},
                            status=status.HTTP_400_BAD_REQUEST)

        if Ticket.objects.filter(user=user, date=today, status=Ticket.PresenceStatus.DEPARTURE).exists():
            return Response({"message": "Départ déjà enregistré."}, status=status.HTTP_400_BAD_REQUEST)

        ticket = Ticket.objects.create(
            user=user,
            date=today,
            status=Ticket.PresenceStatus.DEPARTURE,
            presence_status=Ticket.PresenceStatus.LEFT
        )
        msg = "Départ enregistré avec succès."

    try:
        log_security_event(
            user=user,
            action=f"scan_{action}",
            resource_type="Ticket",
            resource_id=str(ticket.id),
            details={"code_id": code_id, "timestamp": now.isoformat()},
            success=True,
            ip_address=request.META.get("REMOTE_ADDR", "0.0.0.0")
        )
    except Exception:
        pass

    return Response(
        {"message": msg, "ticket": TicketSerializer(ticket).data},
        status=status.HTTP_201_CREATED
    )