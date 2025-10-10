from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .models import User
from .serializers import UserSerializer, LoginSerializer

# Login API with JWT
@api_view(['POST'])
@permission_classes([])  # Allow any user to access login
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Logout API (blacklist refresh token)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({'message': 'Successfully logged out'})
    except Exception as e:
        return Response({'error': 'Error logging out'}, status=status.HTTP_400_BAD_REQUEST)

# Get current user profile
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

# List all users (admin only)
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

# Update user role (admin only)
@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def update_user_role(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.role = request.data.get('role', user.role)
        user.save()
        return Response(UserSerializer(user).data)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
