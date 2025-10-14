from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

app_name = 'accounts'

urlpatterns = [
    # Authentication endpoints
    path('login', views.login_view, name='login'),
    path('logout', views.logout_view, name='logout'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile', views.profile_view, name='profile'),
        
    # User management endpoints (admin only)
    path('users', views.UserListView.as_view(), name='user_list'),
    path('users/create', views.create_user, name='create_user'),
    path('users/import-csv', views.import_users_csv, name='import_users_csv'),
    path('users/<int:user_id>', views.get_user, name='get_user'),
    path('users/<int:user_id>/update', views.update_user, name='update_user'),
    path('users/<int:user_id>/delete', views.delete_user, name='delete_user'),
    path('users/<int:user_id>/role', views.update_user_role, name='update_user_role'),
]