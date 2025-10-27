from django.urls import path
from . import views

urlpatterns = [
    # 🔹 Admin endpoints
    path('teams', views.list_teams, name='list_teams'),
    path('teams/create', views.create_team, name='create_team'),
    path('teams/<int:team_id>/assign-manager', views.assign_manager, name='assign_manager'),
    path('teams/<int:team_id>/remove-manager', views.remove_manager, name='remove_manager'),

    # 🔹 Manager endpoints
    path('teams/my-team', views.get_my_team, name='get_my_team'),
    path('teams/add-member', views.add_member, name='add_member'),
    path('teams/remove-member', views.remove_member, name='remove_member'),
]
