# attendance/urls.py

from django.urls import path
from . import views

app_name = "attendance"
urlpatterns = [
    # 🕒 Gestion classique de présence
    path('arrival', views.mark_arrival, name='mark-arrival'),
    path('departure', views.mark_departure, name='mark-departure'),
    path('status', views.employee_status, name='employee-status'),

    # 🧩 Gestion du QR Code
    path('qr-code', views.generate_qr_code, name='generate-qr-code'),
    path('scan', views.scan_qr_code, name='scan-qr-code'),
]