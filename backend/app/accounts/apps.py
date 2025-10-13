from django.apps import AppConfig
import os
from dotenv import load_dotenv

class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app.accounts'

    def ready(self):
        # Create default admin user when Django starts
        self.create_default_admin()

    def create_default_admin(self):
        try:
            # Load .env file
            load_dotenv()
            
            from .models import User
            from django.db import transaction
            
            # Only create admin if no admin exists
            if not User.objects.filter(role=User.Role.ADMIN).exists():
                
                # Get admin credentials from environment
                admin_username = os.getenv('ADMIN_USERNAME')
                admin_email = os.getenv('ADMIN_EMAIL')
                admin_password = os.getenv('ADMIN_PASSWORD')
                admin_first_name = os.getenv('ADMIN_FIRST_NAME')
                admin_last_name = os.getenv('ADMIN_LAST_NAME')
                admin_phone = os.getenv('ADMIN_PHONE')

                # Validate required fields
                if not all([admin_username, admin_email, admin_password, admin_first_name, admin_last_name]):
                    print("⚠️  Missing required admin credentials in .env file")
                    print("Required: ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_FIRST_NAME, ADMIN_LAST_NAME")
                    return

                # Create admin user in a transaction
                with transaction.atomic():
                    admin_user = User.objects.create_user(
                        username=admin_username,
                        email=admin_email,
                        password=admin_password,
                        firstName=admin_first_name,
                        lastName=admin_last_name,
                        phoneNumber=admin_phone or '',
                        role=User.Role.ADMIN,
                        is_staff=True,
                        is_superuser=True
                    )
                    
                print(f"✅ Default admin created: {admin_user.email} (username: {admin_user.username})")
                
        except Exception as e:
            # Print error for debugging, but don't crash the app
            print(f"⚠️  Could not create default admin: {str(e)}")
            pass
