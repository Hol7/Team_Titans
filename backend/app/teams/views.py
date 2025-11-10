from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from app.accounts.permissions import CanManageTeams, CanManageTeamMembers
from app.accounts.middleware import log_security_event
from .models import Team
from .serializers import TeamSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


# ========================
# 🔹 Vues pour le CA
# ========================

@api_view(['GET'])
@permission_classes([CanManageTeams])
def list_teams(request):
    teams = Team.objects.all()
    serializer = TeamSerializer(teams, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([CanManageTeams])
def create_team(request):
    serializer = TeamSerializer(data=request.data)
    if serializer.is_valid():
        team = serializer.save()
        log_security_event(
            user=request.user,
            action='team_create',
            resource_type='Team',
            resource_id=team.id,
            details={"team_name": team.name},
            ip_address=request.META.get('REMOTE_ADDR', '0.0.0.0')
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([CanManageTeams])
def assign_manager(request, team_id):
    team = get_object_or_404(Team, id=team_id)
    manager_id = request.data.get('manager_id')

    if not manager_id:
        return Response({"error": "manager_id requis."}, status=status.HTTP_400_BAD_REQUEST)

    manager = get_object_or_404(User, id=manager_id)

    if not manager.is_luffy():
        return Response({"error": "Cet utilisateur n'est pas un Luffy."}, status=status.HTTP_400_BAD_REQUEST)

    team.manager = manager
    team.save()

    log_security_event(
        user=request.user,
        action='team_update',
        resource_type='Team',
        resource_id=team.id,
        details={"assigned_manager": manager.username},
        ip_address=request.META.get('REMOTE_ADDR', '0.0.0.0')
    )

    return Response({"message": f"{manager.username} assigné comme manager de {team.name}"})


@api_view(['DELETE'])
@permission_classes([CanManageTeams])
def delete_team(request, team_id):
    team = get_object_or_404(Team, id=team_id)
    team_name = team.name
    team.delete()

    log_security_event(
        user=request.user,
        action='team_delete',
        resource_type='Team',
        resource_id=team_id,
        details={"team_name": team_name},
        ip_address=request.META.get('REMOTE_ADDR', '0.0.0.0')
    )

    return Response({"message": f"Équipe '{team_name}' supprimée."}, status=status.HTTP_200_OK)

# ========================
# 🔹 Vues pour Luffy
# ========================

@api_view(['POST'])
@permission_classes([CanManageTeamMembers])
def add_member(request, team_id):
    team = get_object_or_404(Team, id=team_id)

    if team.manager != request.user:
        return Response({"error": "Vous ne pouvez gérer que votre propre équipe."}, status=status.HTTP_403_FORBIDDEN)

    member_id = request.data.get("member_id")
    member = get_object_or_404(User, id=member_id)
    team.members.add(member)

    log_security_event(
        user=request.user,
        action='team_update',
        resource_type='Team',
        resource_id=team.id,
        details={"added_member": member.username},
        ip_address=request.META.get('REMOTE_ADDR', '0.0.0.0')
    )

    return Response({"message": f"{member.username} ajouté à {team.name}."})


@api_view(['DELETE'])
@permission_classes([CanManageTeamMembers])
def remove_member(request, team_id):
    team = get_object_or_404(Team, id=team_id)

    if team.manager != request.user:
        return Response({"error": "Vous ne pouvez gérer que votre propre équipe."}, status=status.HTTP_403_FORBIDDEN)

    member_id = request.data.get("member_id")
    member = get_object_or_404(User, id=member_id)
    team.members.remove(member)

    log_security_event(
        user=request.user,
        action='team_update',
        resource_type='Team',
        resource_id=team.id,
        details={"removed_member": member.username},
        ip_address=request.META.get('REMOTE_ADDR', '0.0.0.0')
    )

    return Response({"message": f"{member.username} retiré de {team.name}."})
