from django.urls import path
from .views import mark_arrival, mark_departure, user_status

urlpatterns = [
    path("arrival", mark_arrival, name="mark-arrival"),
    path("departure", mark_departure, name="mark-departure"),
    path("status", employee_status, name="employee-status"),
]
