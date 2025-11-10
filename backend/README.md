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
| Pointage |**R** |**R** | **R** | **RI** |**R**|**R**|
| Gestion membres team | | | | **R** | I | |
| Visualisation rapports | | | | | **R** | I |
| Gestion logs | | | | | | **R** |

**Légende :** R=Responsable, A=Autorité, C=Consulté, I=Informé

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
