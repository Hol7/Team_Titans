from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import Team
from .serializers import TeamSerializer

User = get_user_model()

# ============================================
# GCA/CA ACTIONS
# ============================================

@api_view(["GET"])
@permission_classes([permissions.IsAdminUser])
def list_teams(request):
    """List all teams"""
    teams = Team.objects.all()
    serializer = TeamSerializer(teams, many=True)
    return Response({"message": "Teams retrieved successfully.", "data": serializer.data})


@api_view(["POST"])
@permission_classes([permissions.IsAdminUser])
def create_team(request):
    """Create a new team"""
    serializer = TeamSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Team created successfully.", "data": serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([permissions.IsAdminUser])
def assign_manager(request, team_id):
    """Assign a manager to a specific team"""
    try:
        team = Team.objects.get(id=team_id)
    except Team.DoesNotExist:
        return Response({"error": "Team not found."}, status=status.HTTP_404_NOT_FOUND)

    manager_id = request.data.get("manager_id")
    if not manager_id:
        return Response({"error": "manager_id is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        manager = User.objects.get(id=manager_id)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    if Team.objects.filter(manager=manager).exists():
        return Response({"error": "This user already manages another team."}, status=status.HTTP_400_BAD_REQUEST)

    team.manager = manager
    team.save()
    return Response({"message": f"Manager '{manager.username}' assigned to team '{team.name}'."})


@api_view(["POST"])
@permission_classes([permissions.IsAdminUser])
def remove_manager(request, team_id):
    """Remove a manager from a team"""
    try:
        team = Team.objects.get(id=team_id)
    except Team.DoesNotExist:
        return Response({"error": "Team not found."}, status=status.HTTP_404_NOT_FOUND)

    if not team.manager:
        return Response({"message": "This team has no assigned manager."})

    manager_name = team.manager.username
    team.manager = None
    team.save()
    return Response({"message": f"Manager '{manager_name}' removed from team '{team.name}'."})


# ============================================
# 🔹 MANAGER ACTIONS
# ============================================

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def get_my_team(request):
    """Retrieve the team managed by the current user"""
    try:
        team = Team.objects.get(manager=request.user)
    except Team.DoesNotExist:
        return Response({"error": "You are not managing any team."}, status=status.HTTP_404_NOT_FOUND)

    serializer = TeamSerializer(team)
    return Response({"message": "Team retrieved successfully.", "data": serializer.data})


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def add_member(request):
    """Add a member to the team managed by the current user"""
    try:
        team = Team.objects.get(manager=request.user)
    except Team.DoesNotExist:
        return Response({"error": "You are not managing any team."}, status=status.HTTP_404_NOT_FOUND)

    user_id = request.data.get("user_id")
    if not user_id:
        return Response({"error": "user_id is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        member = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    if member in team.members.all():
        return Response({"message": "This user is already a member of your team."})

    team.members.add(member)
    return Response({"message": f"User '{member.username}' added to team '{team.name}'."})


@api_view(["DELETE"])
@permission_classes([permissions.IsAuthenticated])
def remove_member(request):
    """Remove a member from the team managed by the current user"""
    try:
        team = Team.objects.get(manager=request.user)
    except Team.DoesNotExist:
        return Response({"error": "You are not managing any team."}, status=status.HTTP_404_NOT_FOUND)

    user_id = request.data.get("user_id")
    if not user_id:
        return Response({"error": "user_id is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        member = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    if member not in team.members.all():
        return Response({"message": "This user is not part of your team."})

    team.members.remove(member)
    return Response({"message": f"User '{member.username}' removed from team '{team.name}'."})
