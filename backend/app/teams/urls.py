from django.urls import path
from . import views

urlpatterns = [
    # CA
    path('', views.list_teams, name='list_teams'),
    path('create/', views.create_team, name='create_team'),
    path('<int:team_id>/assign-manager/', views.assign_manager, name='assign_manager'),
    path('<int:team_id>/delete/', views.delete_team, name='delete_team'),

    # Luffy
    path('<int:team_id>/add-member/', views.add_member, name='add_member'),
    path('<int:team_id>/remove-member/', views.remove_member, name='remove_member'),
]
