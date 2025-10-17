from django.urls import path
from .views import MarkArrivalView, MarkDepartureView, EmployeeStatusView

urlpatterns = [
    path("arrival/", MarkArrivalView.as_view(), name="mark-arrival"),
    path("departure/", MarkDepartureView.as_view(), name="mark-departure"),
    path("status/", EmployeeStatusView.as_view(), name="employee-status"),
]
