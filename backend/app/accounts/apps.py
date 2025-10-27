from django.apps import AppConfig
import os
from dotenv import load_dotenv

class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app.accounts'

    def ready(self):
        # Create default GCA user when Django starts
        self.create_default_gca()

    def create_default_gca(self):
        try:
            # Load .env file
            load_dotenv()
            
            from .models import User
            from django.db import transaction
            
            # Only create GCA if no GCA exists
            if not User.objects.filter(role=User.Role.GCA).exists():
                
                # Get GCA credentials from environment
                gca_username = os.getenv('GCA_USERNAME')
                gca_email = os.getenv('GCA_EMAIL')
                gca_password = os.getenv('GCA_PASSWORD')
                gca_first_name = os.getenv('GCA_FIRST_NAME')
                gca_last_name = os.getenv('GCA_LAST_NAME')
                gca_phone = os.getenv('GCA_PHONE')

                # Validate required fields
                if not all([gca_username, gca_email, gca_password, gca_first_name, gca_last_name]):
                    print("⚠️  Missing required GCA credentials in .env file")
                    print("Required: GCA_USERNAME, GCA_EMAIL, GCA_PASSWORD, GCA_FIRST_NAME, GCA_LAST_NAME")
                    return

                # Create GCA user in a transaction
                with transaction.atomic():
                    gca_user = User.objects.create_user(
                        username=gca_username,
                        email=gca_email,
                        password=gca_password,
                        firstName=gca_first_name,
                        lastName=gca_last_name,
                        phoneNumber=gca_phone or '',
                        role=User.Role.GCA,
                        is_staff=True,
                        is_superuser=True
                    )
                    
                print(f"✅ Default GCA created: {gca_user.email} (username: {gca_user.username})")
                
        except Exception as e:
            # Print error for debugging, but don't crash the app
            print(f"⚠️  Could not create default GCA: {str(e)}")
            pass
