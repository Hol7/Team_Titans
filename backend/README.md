# TMTT Backend - Documentation Complète

**Team Management & Time Tracking - API Backend Django**

**Version:** 1.0  
**Date:** Octobre 2025  
**Status:** ✅ Production Ready

---

## Table des Matières

- [Vue d'ensemble](#-vue-densemble)
- [Caractéristiques](#-caractéristiques)
- [Stack Technologique](#-stack-technologique)
- [Structure du Projet](#-structure-du-projet)
- [Installation et Configuration](#-installation-et-configuration)
- [Système de Rôles RACI](#-système-de-rôles-raci)
- [Sécurité](#-sécurité)
- [API Documentation](#-api-documentation)
- [Déploiement](#-déploiement)
- [Tests et Monitoring](#-tests-et-monitoring)
- [Dépannage](#-dépannage)

---

## 🎯 Vue d'ensemble

API REST Django pour la gestion d'équipes et le suivi de présence avec un **système de sécurité strict** basé sur une matrice RACI (Responsible, Accountable, Consulted, Informed).

### Objectifs de Sécurité

1. **Confidentialité** : Protection des données sensibles
2. **Intégrité** : Cohérence et exactitude des données
3. **Disponibilité** : Accessibilité continue du service
4. **Traçabilité** : Journalisation de toutes les actions sensibles
5. **Conformité** : Respect des standards OWASP Top 10

---

## ✨ Caractéristiques

### Fonctionnalités Principales
- **Authentification JWT** - Tokens sécurisés avec rotation et blacklisting
- **6 Rôles RACI** - Contrôle d'accès granulaire basé sur la matrice RACI
- **Gestion Utilisateurs** - CRUD complet avec import CSV
- **Audit Complet** - Logging de toutes les actions sensibles
- **Protection Multi-Couches** - XSS, SQL Injection, Brute Force, CSRF

### Sécurité Avancée
- ✅ Hashing Argon2 (mots de passe)
- ✅ HTTPS forcé en production
- ✅ Rate Limiting (anti brute-force)
- ✅ Validation stricte des entrées
- ✅ Headers de sécurité (HSTS, CSP, X-Frame-Options)
- ✅ Middleware d'audit
- ✅ Tests automatisés (OWASP ZAP, Bandit, Safety, Snyk, Trivy)

---

## 🛠 Stack Technologique

| Composant | Technologie | Version |
|-----------|-------------|---------|
| **Framework** | Django | 5.1.1 |
| **API** | Django REST Framework | 3.15.2 |
| **Authentification** | JWT (simplejwt) | 5.3.0 |
| **Database** | SQLite (dev) / PostgreSQL (prod) | - |
| **Hashing** | Argon2 | 23.1.0 |
| **Protection** | Django Defender, Axes | - |
| **Validation** | Bleach | 6.1.0 |
| **Tests Sécurité** | Bandit, Safety, OWASP ZAP | - |
| **Container** | Docker | - |

---

## 📁 Structure du Projet

```
backend/
├── .env                        # Configuration environnement (ne pas commit)
├── manage.py                  # Script de gestion Django
├── requirements.txt           # Dépendances Python
├── security_test.sh          # Script de tests de sécurité
├── db.sqlite3                # Base de données (dev, auto-généré)
│
├── backend/                   # Configuration principale Django
│   ├── settings.py           # Configuration + sécurité
│   ├── urls.py               # Routing principal
│   ├── wsgi.py               # WSGI (production)
│   └── asgi.py               # ASGI (websockets)
│
├── app/                       # Applications Django
│   ├── accounts/             # Gestion utilisateurs & authentification
│   │   ├── models.py         # Modèle User avec 6 rôles RACI
│   │   ├── views.py          # API endpoints
│   │   ├── serializers.py    # Serialization données
│   │   ├── permissions.py    # Permissions basées sur RACI
│   │   ├── middleware.py     # Audit logging
│   │   ├── exceptions.py     # Gestion erreurs sécurisée
│   │   ├── validators.py     # Validation entrées (XSS, SQL injection)
│   │   ├── error_codes.py    # Codes d'erreur standardisés
│   │   └── urls.py           # Routes API
│   │
│   ├── attendance/           # Gestion des pointages
│   ├── reports/              # Génération de rapports
│   └── teams/                # Gestion des équipes
│
├── logs/                      # Logs de sécurité (créer ce dossier)
│   ├── django.log            # Logs généraux
│   └── security.log          # Logs d'audit
│
└── Dockerfile.dev            # Container développement
└── Dockerfile.prod           # Container production
```

---

## 🚀 Installation et Configuration

### Prérequis

- Python 3.11+
- pip ou uv (gestionnaire de paquets)
- Git
- (Optionnel) Docker pour déploiement

### 1️⃣ Première Installation

```bash
# Créer un environnement virtuel
python3.11 -m venv venv

# Activer l'environnement
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Installer les dépendances
pip install uv
uv pip install -r requirements.txt
```

### 2️⃣ Configuration de l'Environnement

Créer votre fichier `.env` à partir du template :

```bash
# Copier le template
cp .env.example .env

# Éditer avec vos vraies valeurs
nano .env
```

**⚠️ Important :** Le fichier `.env` contient des données sensibles et ne doit JAMAIS être commit dans Git (déjà dans `.gitignore`).

### 3️⃣ Setup Base de Données

```bash
# Créer les migrations
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# L'utilisateur GCA sera créé automatiquement au démarrage
```

### 4️⃣ Créer le Dossier de Logs

```bash
mkdir -p logs
chmod 755 logs
touch logs/django.log logs/security.log
chmod 644 logs/*.log
```

### 5️⃣ Démarrer le Serveur

```bash
# Développement
python manage.py runserver

# Le serveur démarre sur http://127.0.0.1:8000
# Admin GCA créé automatiquement
```

---

## 🎭 Système de Rôles RACI

### Les 6 Rôles

| Alias | Rôle Complet | Code | Description |
|-------|--------------|------|-------------|
| **GCA** | Gestion des Comptes | `gca` | Création/modification/suppression des comptes utilisateurs |
| **CA** | Chef d'Analyse | `ca` | Gestion et structuration des équipes (RH) |
| **Pirates** | Employé Standard | `pirates` | Utilisateur de base - pointage et données personnelles |
| **Luffy** | Responsable d'Équipe | `luffy` | Gestion des membres de sa team uniquement |
| **Kira** | Analyste | `kira` | Visualisation globale des rapports (lecture seule) |
| **Jarvis** | Cyber Sécurité | `jarvis` | Supervision logs, sécurité, détection d'incidents |

### Matrice de Permissions RACI

| Fonctionnalité | GCA | CA | Pirates | Luffy | Kira | Jarvis |
|----------------|:---:|:--:|:-------:|:-----:|:----:|:------:|
| Gestion comptes | **R** | | | | | I |
| Gestion équipes | A | **R** | | | | I |
| Pointage | | | **R** | I | | |
| Gestion membres team | | | | **R** | I | |
| Visualisation rapports | | | | | **R** | I |
| Gestion logs | | | | | | **R** |

**Légende :** R=Responsable, A=Autorité, C=Consulté, I=Informé

### Créer des Utilisateurs

#### Via Django Shell

```bash
python manage.py shell
```

```python
from app.accounts.models import User

# GCA
User.objects.create_user(
    username='gca_admin',
    email='gca@tmtt.com',
    password='GCAPass123!',
    firstName='Admin',
    lastName='GCA',
    role=User.Role.GCA
)

# Jarvis (Cyber Sécurité)
User.objects.create_user(
    username='jarvis',
    email='security@tmtt.com',
    password='JarvisPass123!',
    firstName='Jarvis',
    lastName='Security',
    role=User.Role.JARVIS
)

# CA (RH)
User.objects.create_user(
    username='rh_chief',
    email='rh@tmtt.com',
    password='RHPass123!',
    firstName='Chef',
    lastName='RH',
    role=User.Role.CA
)

# Luffy (Manager)
User.objects.create_user(
    username='luffy',
    email='manager@tmtt.com',
    password='LuffyPass123!',
    firstName='Luffy',
    lastName='Manager',
    role=User.Role.LUFFY
)

# Kira (Analyste)
User.objects.create_user(
    username='kira',
    email='analyst@tmtt.com',
    password='KiraPass123!',
    firstName='Kira',
    lastName='Analyst',
    role=User.Role.KIRA
)

# Pirates (Employé)
User.objects.create_user(
    username='employee1',
    email='employee@tmtt.com',
    password='EmpPass123!',
    firstName='John',
    lastName='Doe',
    role=User.Role.PIRATES
)
```

---

## 🔐 Sécurité

### Protection Implémentée

#### 1. Gestion des Erreurs
- Messages génériques en production (pas de détails techniques)
- Codes HTTP appropriés
- Logging sécurisé sans données sensibles

#### 2. Protection contre les Attaques

**XSS (Cross-Site Scripting)**
- Sanitization avec Bleach
- Validation stricte des entrées
- Headers de sécurité (`X-XSS-Protection`, CSP)

**SQL Injection**
- ORM Django (protection native)
- Détection de mots-clés SQL suspects
- Validation des entrées

**Brute Force**
- Django Defender : blocage après 5 tentatives
- Django Axes : tracking des authentifications
- Rate limiting : 5 tentatives/minute
- Cooldown de 5 minutes

**CSRF**
- Protection CSRF activée
- Tokens CSRF obligatoires
- SameSite cookies

#### 3. Validation des Entrées

**Validateurs Personnalisés** (`validators.py`) :
- `validate_no_html` : Bloque les balises HTML
- `validate_no_sql_keywords` : Détecte les injections SQL
- `validate_password_strength` : Force mots de passe forts
- `validate_email_secure` : Bloque domaines suspects
- `validate_username_secure` : Alphanumériques uniquement

#### 4. Audit et Logging

**Middleware d'Audit** (`middleware.py`) :
- Modèle `AuditLog` avec indexation optimisée
- Logs en console et fichiers (`logs/security.log`)
- Actions tracées :
  - Connexions/déconnexions
  - Échecs de connexion
  - Modifications utilisateurs
  - Changements de rôles
  - Accès refusés
- **Jamais de mots de passe** dans les logs

#### 5. Configuration Production

En production (`DEBUG=False`) :
```python
SECURE_SSL_REDIRECT = True          # Force HTTPS
SECURE_HSTS_SECONDS = 31536000      # HSTS 1 an
SESSION_COOKIE_SECURE = True        # Cookies sécurisés
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'
```

### Tests de Sécurité Automatisés

#### Pipeline CI/CD (`.github/workflows/security.yml`)

1. **Snyk** - Scan des dépendances
2. **Bandit** - Analyse du code Python
3. **Safety** - Vulnérabilités connues
4. **Trivy** - Scan des images Docker
5. **OWASP ZAP** - Tests dynamiques
6. **Security Gate** - Blocage si vulnérabilités critiques

#### Tests Locaux

```bash
# Exécuter le script de tests
chmod +x security_test.sh
./security_test.sh

# Tests individuels
bandit -r app/ backend/
safety check
python manage.py check --deploy
```

---

## 📡 API Documentation

### Base URL
```
http://127.0.0.1:8000/api/v1/
```

### Endpoints d'Authentification

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/auth/login` | Connexion utilisateur | ❌ |
| POST | `/auth/logout` | Déconnexion | ✅ |
| POST | `/auth/token/refresh` | Rafraîchir le token | ❌ |
| GET | `/auth/profile` | Profil utilisateur | ✅ |

### Endpoints Gestion Utilisateurs (GCA uniquement)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/auth/users` | Liste utilisateurs | ✅ GCA |
| POST | `/auth/users/create` | Créer utilisateur | ✅ GCA |
| POST | `/auth/users/import-csv` | Import CSV | ✅ GCA |
| GET | `/auth/users/{id}` | Détails utilisateur | ✅ GCA |
| PUT | `/auth/users/{id}/update` | Modifier utilisateur | ✅ GCA |
| DELETE | `/auth/users/{id}/delete` | Supprimer utilisateur | ✅ GCA |
| PATCH | `/auth/users/{id}/role` | Changer rôle | ✅ GCA |

### Exemples d'Utilisation

#### Connexion
```bash
curl -X POST http://127.0.0.1:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "gca",
    "password": "GCA123456!"
  }'
```

**Réponse :**
```json
{
  "refresh": "eyJ0eXAiOiJKV1Q...",
  "access": "eyJ0eXAiOiJKV1Q...",
  "user": {
    "id": 1,
    "username": "gca",
    "firstName": "GCA",
    "lastName": "User",
    "email": "gca@tmtt.com",
    "role": "gca"
  }
}
```

#### Utiliser le Token

```bash
# Définir le token
export TOKEN="votre_access_token"

# Accéder au profil
curl -X GET http://127.0.0.1:8000/api/v1/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

#### Créer un Utilisateur

```bash
curl -X POST http://127.0.0.1:8000/api/v1/auth/users/create \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "employee1",
    "email": "employee1@company.com",
    "password": "EmpPass123!",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "1234567890",
    "role": "pirates"
  }'
```

---

## 🚀 Déploiement

### Préparation Production

#### 1. Variables d'Environnement

Modifier `.env` pour la production :

```bash
# CRITIQUE : Désactiver le debug
DEBUG=False

# Générer une nouvelle SECRET_KEY
SECRET_KEY=votre-cle-super-securisee-aleatoire-longue

# Hosts autorisés
ALLOWED_HOSTS=votredomaine.com,www.votredomaine.com

# Database PostgreSQL
DATABASE_ENGINE=django.db.backends.postgresql
DATABASE_NAME=tmtt_prod
DATABASE_USER=tmtt_user
DATABASE_PASSWORD=mot-de-passe-tres-securise
DATABASE_HOST=db-host
DATABASE_PORT=5432

# Sécurité HTTPS
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True

# CORS
CORS_ALLOWED_ORIGINS=https://votredomaine.com

# Redis (pour Defender)
REDIS_URL=redis://localhost:6379/0
```

#### 2. Vérifications de Sécurité

```bash
# Vérifier la configuration Django
python manage.py check --deploy

# Scanner le code
bandit -r app/ backend/

# Vérifier les vulnérabilités
safety check

# Tests de sécurité
chmod +x security_test.sh
./security_test.sh
```

#### 3. Migrations Database

```bash
# Créer les migrations
python manage.py makemigrations

# Appliquer
python manage.py migrate

# Collecter les fichiers statiques
python manage.py collectstatic --noinput
```

#### 4. Déploiement Docker

```bash
# Build de l'image
docker build -f Dockerfile.prod -t tmtt-backend:v1.0 .

# Scanner l'image
trivy image tmtt-backend:v1.0

# Si OK, lancer
docker-compose -f docker-compose.prod.yml up -d
```

### Checklist Post-Déploiement

**Sécurité :**
- [ ] `DEBUG=False`
- [ ] HTTPS activé (certificat SSL)
- [ ] HSTS headers activés
- [ ] Cookies sécurisés
- [ ] CORS configuré
- [ ] Rate limiting actif

**Logs et Monitoring :**
- [ ] Dossier `logs/` créé
- [ ] Logs de sécurité fonctionnels
- [ ] Rotation des logs configurée
- [ ] Monitoring actif

**Base de Données :**
- [ ] Migrations appliquées
- [ ] Backup automatique configuré
- [ ] Credentials sécurisés

**Tests :**
- [ ] Tests unitaires OK
- [ ] Scan Bandit OK
- [ ] Scan Safety OK
- [ ] OWASP ZAP scan passé
- [ ] Trivy scan OK

**Utilisateurs :**
- [ ] Utilisateur GCA créé
- [ ] Utilisateur Jarvis créé
- [ ] Rôles RACI testés

---

## 🧪 Tests et Monitoring

### Tests Unitaires

```bash
# Installer les dépendances de test
pip install pytest pytest-django coverage

# Lancer les tests
python manage.py test

# Avec pytest
pytest

# Avec coverage
coverage run --source='.' manage.py test
coverage report
coverage html  # Rapport HTML dans htmlcov/
```

### Monitoring des Logs

#### En Temps Réel
```bash
# Logs de sécurité
tail -f logs/security.log

# Logs Django
tail -f logs/django.log
```

#### Via Django Shell
```python
from app.accounts.middleware import AuditLog
from datetime import datetime, timedelta

# Dernières 20 actions
AuditLog.objects.all().order_by('-timestamp')[:20]

# Connexions échouées (24h)
cutoff = datetime.now() - timedelta(hours=24)
AuditLog.objects.filter(
    action='login_failed',
    timestamp__gte=cutoff
)

# Actions d'un utilisateur
AuditLog.objects.filter(username='suspect_user')

# Compter les tentatives d'accès refusé
AuditLog.objects.filter(action='permission_denied').count()
```

#### Gestion des Blocages

```python
from defender.models import AccessAttempt

# Voir les IPs bloquées
AccessAttempt.objects.filter(failures_since_start__gte=5)

# Débloquer un compte
AccessAttempt.objects.filter(username='locked_user').delete()

# Débloquer une IP
AccessAttempt.objects.filter(ip_address='192.168.1.100').delete()
```

### Maintenance

#### Nettoyage des Logs

```python
from datetime import datetime, timedelta
from app.accounts.middleware import AuditLog

# Supprimer les logs > 90 jours
cutoff = datetime.now() - timedelta(days=90)
deleted = AuditLog.objects.filter(timestamp__lt=cutoff).delete()
print(f"Supprimé {deleted[0]} logs")
```

#### Mise à Jour des Dépendances

```bash
# Lister les packages obsolètes
pip list --outdated

# Vérifier les vulnérabilités
safety check

# Mettre à jour un package
pip install -U nom_package

# Mettre à jour requirements.txt
pip freeze > requirements.txt
```

---

## 🐛 Dépannage

### Problèmes Courants

#### 1. "No module named 'rest_framework'"
```bash
# Solution : Installer les dépendances
pip install -r requirements.txt
```

#### 2. "Authentication credentials were not provided"
- Vérifier que le token JWT est dans le header `Authorization: Bearer TOKEN`
- Vérifier que le token n'a pas expiré (60 min par défaut)
- Utiliser `/auth/token/refresh` si besoin

#### 3. "Invalid credentials" lors du login
- Vérifier username/password
- Vérifier que l'utilisateur existe
- Vérifier que le compte n'est pas bloqué (Defender)

#### 4. Compte bloqué (Brute Force)
```python
# Django shell
from defender.models import AccessAttempt
AccessAttempt.objects.filter(username='utilisateur').delete()
```

#### 5. Erreurs de migration
```bash
# Supprimer la DB et recommencer (DEV UNIQUEMENT)
rm db.sqlite3
rm -rf app/*/migrations/00*.py
python manage.py makemigrations
python manage.py migrate
```

#### 6. Logs ne s'affichent pas
```bash
# Créer le dossier logs
mkdir -p logs
chmod 755 logs
touch logs/django.log logs/security.log
chmod 644 logs/*.log
```

#### 7. CORS errors (avec frontend)
- Vérifier `CORS_ALLOWED_ORIGINS` dans `.env`
- Redémarrer le serveur après modification

### Mode Debug

Pour activer le logging détaillé, dans `.env` :
```bash
DEBUG=True
LOG_LEVEL=DEBUG
ENABLE_SQL_LOGGING=True
```

**⚠️ JAMAIS en production !**

---

## 📞 Support et Ressources

### Contacts

| Rôle | Email | Responsabilité |
|------|-------|----------------|
| **Jarvis** | security@tmtt.com | Incidents de sécurité |
| **GCA** | admin@tmtt.com | Gestion des accès |
| **DevOps** | devops@tmtt.com | Infrastructure |

### Ressources Externes

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Argon2 Password Hashing](https://github.com/P-H-C/phc-winner-argon2)

### Outils Recommandés

**API Testing :**
- Postman
- Thunder Client (VS Code)
- curl (CLI)

**Monitoring :**
- Django Admin : `http://127.0.0.1:8000/admin/`
- Logs : `tail -f logs/security.log`

**Sécurité :**
- Bandit (code scanning)
- Safety (vulnérabilités)
- OWASP ZAP (pentesting)

---

## 📊 Standards de Conformité

### OWASP Top 10 (2021)

| Risque | Mitigation |
|--------|------------|
| A01: Broken Access Control | ✅ Permissions RACI |
| A02: Cryptographic Failures | ✅ Argon2, HTTPS, JWT |
| A03: Injection | ✅ Validation stricte, ORM |
| A05: Security Misconfiguration | ✅ Headers sécurisés |
| A07: Authentication Failures | ✅ JWT, Defender, Axes |
| A09: Security Logging Failures | ✅ Audit complet |

### CWE Top 25
- ✅ Mitigations implémentées pour les vulnérabilités courantes

### GDPR
- ✅ Logging conforme
- ✅ Pas de PII exposées dans les logs ou erreurs

---

## 📝 Commandes Utiles

### Développement
```bash
# Démarrer le serveur
python manage.py runserver

# Créer un superuser
python manage.py createsuperuser

# Shell Django
python manage.py shell

# Vérifier la configuration
python manage.py check
```

### Database
```bash
# Créer les migrations
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Rollback à une migration
python manage.py migrate app_name migration_number
```

### Sécurité
```bash
# Tests de sécurité
./security_test.sh

# Scanner le code
bandit -r app/ backend/

# Vulnérabilités
safety check

# Configuration production
python manage.py check --deploy
```

### Monitoring
```bash
# Logs en temps réel
tail -f logs/security.log

# Connexions échouées
grep "LOGIN_FAILED" logs/security.log | wc -l

# IPs suspectes
grep "PERMISSION_DENIED" logs/security.log | awk '{print $NF}' | sort | uniq -c | sort -rn
```

---

## 🔄 Changelog

### Version 1.0 (Octobre 2025)
- ✅ Système de rôles RACI (6 rôles)
- ✅ Permissions granulaires
- ✅ Audit logging complet
- ✅ Protection XSS, SQL Injection, Brute Force, CSRF
- ✅ Tests automatisés (CI/CD)
- ✅ Validation stricte des entrées
- ✅ Configuration sécurité production
- ✅ Documentation complète

---

**Document maintenu par :** Équipe DevSecOps TMTT  
**Dernière mise à jour :** 27 Octobre 2025  
**Version :** 1.0  
**Licence :** Propriétaire

---

## ⚡ Quick Start (Résumé)

```bash
# 1. Installation
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 2. Configuration
cp .env.example .env
# Éditer .env avec vos vraies valeurs

# 3. Database
python manage.py makemigrations
python manage.py migrate

# 4. Logs
mkdir -p logs && chmod 755 logs

# 5. Lancer
python manage.py runserver

# 6. Tester
chmod +x security_test.sh
./security_test.sh

# ✅ API disponible sur http://127.0.0.1:8000
# ✅ Admin GCA : gca / GCA123456!
```

---

🎉 **Votre backend TMTT est prêt à l'emploi avec une sécurité de niveau production !**
