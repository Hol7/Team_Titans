# Team Management & Attendance System - Backend API

A comprehensive Django REST API for managing employee attendance, teams, and user accounts with JWT authentication.

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [First Time Setup](#-first-time-setup)
- [Existing Project Setup](#-existing-project-setup)
- [Environment Configuration](#-environment-configuration)
- [API Documentation](#-api-documentation)
- [Authentication](#-authentication)
- [User Management](#-user-management)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

## 🎯 Project Overview

This is a Django REST Framework-based backend API designed for team management and attendance tracking. The system supports three user roles (Admin, Manager, Employee) with JWT-based authentication and comprehensive user management capabilities.

## ✨ Features

### Core Features
- **JWT Authentication** - Secure token-based authentication with refresh tokens
- **Role-Based Access Control** - Admin, Manager, and Employee roles
- **User Management** - Complete CRUD operations for user accounts
- **Automatic Admin Creation** - First admin account created automatically on startup
- **CSV Bulk Import** - Import multiple users from CSV files
- **Environment-Based Configuration** - Secure configuration via `.env` file

### Security Features
- **JWT Token Rotation** - Refresh tokens are rotated for enhanced security
- **Token Blacklisting** - Logout functionality blacklists refresh tokens
- **Environment Variable Protection** - No hardcoded credentials
- **CORS Configuration** - Cross-origin request handling

## 🛠 Technology Stack

- **Framework**: Django 5.1.1
- **API**: Django REST Framework 3.15.2
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Database**: SQLite (development) / MySQL (production)
- **Environment Management**: python-dotenv
- **Testing**: pytest, pytest-django
- **Code Coverage**: coverage

## 📁 Project Structure

```
backend/
├── .env                    # Environment variables (create from template)
├── manage.py              # Django management script
├── requirements.txt       # Python dependencies
├── sample_users.csv      # Sample CSV for bulk import
├── test_user.sh          # Testing script
├── db.sqlite3            # SQLite database (auto-generated)
│
├── backend/               # Main Django project
│   ├── settings.py       # Django configuration
│   ├── urls.py          # Main URL routing
│   └── wsgi.py          # WSGI configuration
│
└── app/                  # Django applications
    ├── accounts/         # User management & authentication
    │   ├── models.py    # User model with roles
    │   ├── views.py     # API endpoints
    │   ├── serializers.py # Data serialization
    │   ├── urls.py      # URL routing
    │   └── apps.py      # Auto admin creation logic
    │
    ├── attendance/       # Attendance tracking (future)
    ├── reports/         # Report generation (future)
    └── teams/           # Team management (future)
```

## 🚀 First Time Setup

### Prerequisites
- Python 3.11+
- pip (Python package installer)
- Git

### Step 1: Clone and Navigate
```bash
git clone <repository-url>
cd T-DEV-700-project-COT_2/backend
```

### Step 2: Create Virtual Environment
```bash
# Create virtual environment
python3.11 -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

### Step 3: Install Dependencies
```bash
pip install uv
uv pip install -r requirements.txt
```

### Step 4: Environment Configuration
```bash
# The .env file should already exist
```

### Step 5: Database Setup
```bash
# Create database tables
cd app
python3. ../manage.py makemigrations
python3 ../manage.py migrate

# The admin user will be created automatically when you start the server
```

### Step 6: Start Development Server
```bash
cd ..
python3 manage.py runserver
```

✅ **Server will start on**: `http://127.0.0.1:8000`\
✅ **Admin account**: Created automatically with credentials from `.env`

## 🔄 Existing Project Setup

If the project has been previously set up:

### Quick Start
```bash
# Navigate to backend directory
cd T-DEV-700-project-COT_2/backend

# Activate virtual environment
source venv/bin/activate

# Install any new dependencies
uv pip install -r requirements.txt

# Apply any new migrations
python3 manage.py migrate

# Start server
python3 manage.py runserver
```

### Update Dependencies
```bash
uv pip install -r requirements.txt --upgrade
```

## ⚙️ Environment Configuration

### .env File Structure

## 📡 API Documentation

### Base URL
```
http://127.0.0.1:8000/api/v1/
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | User login | ❌ |
| POST | `/auth/logout` | User logout | ✅ |
| POST | `/auth/token/refresh` | Refresh JWT token | ❌ |
| GET | `/auth/profile` | Get current user profile | ✅ |

### User Management Endpoints (Admin Only)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/auth/users` | List all users | ✅ Admin |
| POST | `/auth/users/create` | Create new user | ✅ Admin |
| POST | `/auth/users/import-csv` | Bulk import from CSV | ✅ Admin |
| GET | `/auth/users/{id}` | Get user details | ✅ Admin |
| PUT | `/auth/users/{id}/update` | Update user | ✅ Admin |
| DELETE | `/auth/users/{id}/delete` | Delete user | ✅ Admin |
| PATCH | `/auth/users/{id}/role` | Update user role | ✅ Admin |

## 🔐 Authentication

### Login Request
```bash
curl -X POST http://127.0.0.1:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123456"
  }'
```

### Login Response
```json
{
  "refresh": "eyJ0eXAiOiJKV1Q...",
  "access": "eyJ0eXAiOiJKV1Q...",
  "user": {
    "id": 1,
    "username": "admin",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@company.com",
    "phoneNumber": "0145456598",
    "role": "admin"
  }
}
```

### Using JWT Tokens

Include the access token in the Authorization header:
```bash
curl -X GET http://127.0.0.1:8000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Token Refresh
```bash
curl -X POST http://127.0.0.1:8000/api/v1/auth/token/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "YOUR_REFRESH_TOKEN"
  }'
```

## 👥 User Management

### User Roles

1. **Admin**: Full system access, can manage all users
2. **Manager**: Team management capabilities (future feature)
3. **Employee**: Basic access, can view own profile

### Creating Users

#### Single User Creation
```bash
curl -X POST http://127.0.0.1:8000/api/v1/auth/users/create \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "employee1",
    "email": "employee1@company.com",
    "password": "employee123456",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "1234567890",
    "role": "employee"
  }'
```

#### CSV Bulk Import

1. **Prepare CSV file** (see `sample_users.csv` for format):
```csv
username,email,password,firstName,lastName,phoneNumber,role
employee1,employee1@company.com,emp123456,John,Doe,1234567890,employee
manager1,manager1@company.com,mgr123456,Jane,Smith,0987654321,manager
```

2. **Import via API**:
```bash
curl -X POST http://127.0.0.1:8000/api/v1/auth/users/import-csv \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "csv_file=@sample_users.csv"
```

### User List Response
```json
{
  "count": 3,
  "results": [
    {
      "id": 1,
      "username": "admin",
      "firstName": "Admin",
      "lastName": "User",
      "email": "admin@company.com",
      "phoneNumber": "0145456598",
      "role": "admin"
    },
    {
      "id": 2,
      "username": "employee1",
      "firstName": "John",
      "lastName": "Doe",
      "email": "employee1@company.com",
      "phoneNumber": "1234567890",
      "role": "employee"
    }
  ]
}
```

## 🧪 Testing

### Manual Testing Script

The project includes a test script for API endpoints:

```bash
# Make script executable
chmod +x test_user.sh

# Edit the script to add your JWT token
nano test_user.sh

# Run tests
./test_user.sh
```

### Running Unit Tests
```bash
# Install test dependencies (if not already installed)
pip install pytest pytest-django coverage

# Run tests
python3 manage.py test

# Or with pytest
pytest

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```

### Test Login Credentials

Default test accounts (after running CSV import):
- **Admin**: `admin` / `admin123456`
- **Employee**: `employee1` / `emp123456`  
- **Manager**: `manager1` / `mgr123456`

## 🐛 Troubleshooting

### Common Issues

#### 1. "No module named 'rest_framework'"
```bash
# Solution: Install dependencies
uv pip install -r requirements.txt
```

#### 2. "Authentication credentials were not provided"
- Ensure you're including the JWT token in the Authorization header
- Check that the token hasn't expired (60 minutes default)
- Use token refresh endpoint if needed

#### 3. "Invalid credentials" on login
- Verify username/password are correct
- Check that the user exists in the database
- Ensure the admin account was created (should happen automatically)

#### 4. Admin account not created
- Check `.env` file has all required ADMIN_* variables
- Restart the Django server
- Check server console for creation messages

#### 5. Database errors
```bash
# Reset database (CAUTION: This deletes all data)
rm db.sqlite3
python3 manage.py migrate
```

#### 6. CORS errors (when using with frontend)
- Update `CORS_ALLOWED_ORIGINS` in `.env`
- Install and configure django-cors-headers

### Debug Mode

Enable debug logging by setting in `.env`:
```bash
DEBUG=True
```

### Logs Location

Django logs are displayed in the console when running the development server.

## 📞 Support

### API Testing Tools

1. **Browser-based**:
   - Django admin interface: `http://127.0.0.1:8000/admin/`
   - Use admin credentials from `.env`

2. **HTTP Clients**:
   - Postman
   - Thunder Client (VS Code)
   - curl (command line)

3. **API Documentation**:
   - All endpoints documented above
   - Test with provided curl commands

### Getting Help

1. Check this README thoroughly
2. Verify your environment configuration
3. Test with provided sample data
4. Use the included test script for validation

---

**Note**: This backend API is designed to work with a React frontend. The CORS settings in the configuration allow cross-origin requests from the frontend development server.
