from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .models import User
from .serializers import UserSerializer, LoginSerializer
import csv
import io


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

# Create new user (admin only)
@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_user(request):
    data = request.data.copy()
    password = data.get('password')
    
    if not password:
        return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.create_user(
            username=data.get('username'),
            email=data.get('email'),
            password=password,
            firstName=data.get('firstName'),
            lastName=data.get('lastName'),
            phoneNumber=data.get('phoneNumber', ''),
            role=data.get('role', User.Role.EMPLOYEE)
        )
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Import users from CSV (admin only)
@api_view(['POST'])
@permission_classes([IsAdminUser])
def import_users_csv(request):
    if 'csv_file' not in request.FILES:
        return Response({'error': 'No CSV file provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    csv_file = request.FILES['csv_file']
    if not csv_file.name.endswith('.csv'):
        return Response({'error': 'File must be CSV format'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Read CSV file
        decoded_file = csv_file.read().decode('utf-8')
        csv_data = csv.DictReader(io.StringIO(decoded_file))
        
        created_users = []
        errors = []
        
        for row_num, row in enumerate(csv_data, start=2):  # Start at 2 because row 1 is header
            try:
                # Check required fields
                required_fields = ['username', 'email', 'password', 'firstName', 'lastName']
                missing_fields = [field for field in required_fields if not row.get(field)]
                
                if missing_fields:
                    errors.append(f"Row {row_num}: Missing fields: {', '.join(missing_fields)}")
                    continue
                
                # Create user
                user = User.objects.create_user(
                    username=row['username'],
                    email=row['email'],
                    password=row['password'],
                    firstName=row['firstName'],
                    lastName=row['lastName'],
                    phoneNumber=row.get('phoneNumber', ''),
                    role=row.get('role', User.Role.EMPLOYEE)
                )
                created_users.append(UserSerializer(user).data)
                
            except Exception as e:
                errors.append(f"Row {row_num}: {str(e)}")
        
        return Response({
            'message': f'Successfully imported {len(created_users)} users',
            'created_users': created_users,
            'errors': errors
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({'error': f'Failed to process CSV: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

# Get user details (admin only)
@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        return Response(UserSerializer(user).data)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

# Update user (admin only)
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAdminUser])
def update_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        data = request.data
        
        # Update fields
        if 'firstName' in data:
            user.firstName = data['firstName']
        if 'lastName' in data:
            user.lastName = data['lastName']
        if 'email' in data:
            user.email = data['email']
        if 'phoneNumber' in data:
            user.phoneNumber = data['phoneNumber']
        if 'role' in data:
            user.role = data['role']
        if 'is_active' in data:
            user.is_active = data['is_active']
        if 'password' in data and data['password']:
            user.set_password(data['password'])
            
        user.save()
        return Response(UserSerializer(user).data)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Delete user (admin only)
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return Response({'message': 'User deleted successfully'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

# Update user role (admin only) - kept for compatibility
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




