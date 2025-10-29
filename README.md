# Team Titans - TMTT Project

**Team Management & Time Tracking - Plateforme complète de gestion d'équipes**

[![Django](https://img.shields.io/badge/Django-5.1.1-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Security](https://img.shields.io/badge/Security-OWASP-red.svg)](https://owasp.org/)

---

## Vue d'ensemble

TMTT est une plateforme full-stack pour la gestion d'équipes et le suivi de présence avec un système de sécurité avancé basé sur la matrice RACI.

### 🏗 Architecture

```
T-DEV-700-project-COT_2/
├── backend/          # API Django REST avec sécurité RACI
├── frontend/         # Interface React
├── .github/          # CI/CD GitHub Actions
└── docker-compose.yml
```

### Caractéristiques principales

- **Backend Django** - API REST sécurisée avec 6 rôles RACI
- **Frontend React** - Interface utilisateur moderne
- **Authentification JWT** - Tokens sécurisés avec rotation
- **Protection Multi-Couches** - OWASP Top 10, brute force, XSS, SQL injection
- **CI/CD Complet** - Tests automatisés et security scans
- **Docker Ready** - Déploiement simplifié

---

## Démarrage Rapide

### Prérequis

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- Git Flow

### Installation locale 

```bash
# Cloner le repository
git clone https://github.com/EpitechMscProPromo2027/T-DEV-700-project-COT_2.git
cd T-DEV-700-project-COT_2
```
### Avec Docker (pas encore disponible)
```bash
# Démarrer les services
docker-compose up --build

# Backend disponible sur : http://localhost:8000
# Frontend disponible sur : http://localhost:3000
```
### Installation manuelle

#### Backend

```bash
cd backend

# Installer uv (gestionnaire de packages)
pip install uv

# Installer les dépendances
uv pip install -r requirements.txt

# Configuration
cp .env.example .env
# Éditer .env avec vos valeurs

# Migrations et démarrage
python manage.py migrate
python manage.py runserver
```

📖 **Documentation complète** : [`backend/README.md`](backend/README.md)

#### Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Configuration
cp .env.example .env
# Éditer .env avec vos valeurs

# Démarrage
npm start
```

📖 **Documentation complète** : [`frontend/README.md`](frontend/README.md)

---

## 🌳 Workflow Git - GitFlow

Nous utilisons **GitFlow** pour organiser le développement.

### Installation Git Flow

```bash
sudo apt install git-flow
git flow init  # Accepter les valeurs par défaut
```

### Cycle de développement

```bash
# 1️⃣ Créer une nouvelle fonctionnalité
git flow feature start nom-de-la-feature

# 2️⃣ Travailler et commiter
git add .
git commit -m "feat(scope): description"

# 3️⃣ Finir la feature
git flow feature finish nom-de-la-feature
git push origin develop

# 4️⃣ Créer une release
git flow release start v1.0.0
git flow release finish v1.0.0
git push origin main develop --tags

# 5️⃣ Hotfix urgent
git flow hotfix start fix-critical-bug
git flow hotfix finish fix-critical-bug
git push origin main develop --tags
```

### Convention de Commits

Nous suivons [Conventional Commits](https://www.conventionalcommits.org/) :

```
<type>(scope): message court

Types:
- feat     : Nouvelle fonctionnalité
- fix      : Correction de bug
- docs     : Documentation
- style    : Formatage
- refactor : Refactorisation
- test     : Tests
- chore    : Maintenance, CI/CD
```

**Exemples :**
```bash
git commit -m "feat(api): add user registration endpoint"
git commit -m "fix(auth): correct JWT token validation"
git commit -m "docs(readme): update installation guide"
```

---

## 📁 Structure du Projet

### Backend (`/backend`)

API REST Django avec :
- ✅ 6 rôles RACI (GCA, CA, Pirates, Luffy, Kira, Jarvis)
- ✅ Authentification JWT
- ✅ Protection OWASP (XSS, SQL injection, brute force)
- ✅ Audit logging complet
- ✅ Tests de sécurité automatisés

**Technologies :** Django 5.1.1, DRF, JWT, Argon2, PostgreSQL

📖 [Documentation Backend complète](backend/README.md)

### Frontend (`/frontend`)

Interface React moderne avec :
- ✅ Design responsive
- ✅ Gestion d'état
- ✅ Intégration API
- ✅ Authentification JWT

**Technologies :** React 18, React Router, Axios

📖 [Documentation Frontend complète](frontend/README.md)

---

## 🔐 Sécurité

### Système RACI - 6 Rôles

| Rôle | Description | Accès |
|------|-------------|-------|
| **GCA** | Super Admin | Accès total |
| **CA** | Chef d'Agence | Gestion multi-agences |
| **Pirates** | Manager d'Équipe | Gestion équipe |
| **Luffy** | Responsable Projet | Gestion projet |
| **Kira** | Responsable Support | Support technique |
| **Jarvis** | Membre | Accès basique |

### Protection Multi-Couches

- **Authentification** : JWT avec rotation et blacklisting
- **Hashing** : Argon2 pour les mots de passe
- **Protection** : Brute force (Django Defender + Axes)
- **Validation** : Anti-XSS, anti-SQL injection (Bleach)
- **Headers** : HSTS, CSP, X-Frame-Options
- **Rate Limiting** : Limitation des requêtes
- **Audit** : Logging de toutes les actions sensibles

### Security Scans (CI/CD)

- **Snyk** - Scan des dépendances
- **Bandit** - Analyse statique Python
- **Safety** - Vulnérabilités connues
- **Trivy** - Scan des images Docker
- **OWASP ZAP** - Tests de sécurité dynamiques

---

## 🔄 CI/CD - GitHub Actions

Pipeline automatisé sur chaque push vers `main` :

### Backend Pipeline
1. Installation Python 3.11 + dépendances
2. Linting et tests unitaires
3. Security scans (Bandit, Safety, Snyk)
4. Build Docker (`dev` et `prod`)
5. Scan Trivy des images

### Frontend Pipeline
1. Installation Node.js + dépendances
2. Linting et tests
3. Build React
4. Build Docker (`dev` et `prod`)

### Security Pipeline
- Exécution quotidienne à 2h du matin
- Scan complet (Snyk, Bandit, Safety, Trivy, OWASP ZAP)
- Rapport consolidé
- Blocage du déploiement si vulnérabilités critiques

---

## 🐳 Déploiement

### Développement (Docker Compose)

```bash
docker-compose up --build
```

### Production

#### Backend
```bash
cd backend
cp .env.production.example .env
# Éditer .env avec les vraies valeurs

# Docker
docker build -f Dockerfile.prod -t tmtt-backend:prod .
docker run -p 8000:8000 tmtt-backend:prod
```

#### Frontend
```bash
cd frontend
cp .env.production.example .env
# Éditer .env avec les vraies valeurs

# Docker
docker build -f Dockerfile.prod -t tmtt-frontend:prod .
docker run -p 3000:80 tmtt-frontend:prod
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Backend README](backend/README.md) | Documentation complète de l'API Django |
| [Frontend README](frontend/README.md) | Documentation de l'interface React |
| `.env.example` | Configuration développement (backend et frontend) |
| `.env.production.example` | Configuration production |

---

## 🧪 Tests

### Backend
```bash
cd backend
python manage.py test
coverage run --source='.' manage.py test
coverage report
```

### Frontend
```bash
cd frontend
npm test
npm run test:coverage
```

### Security Tests
```bash
cd backend
./security_test.sh
```

---

## 🤝 Contribution

1. Fork le projet
2. Créer une feature branch (`git flow feature start ma-feature`)
3. Commit avec convention (`git commit -m 'feat(scope): description'`)
4. Finir la feature (`git flow feature finish ma-feature`)
5. Push vers develop (`git push origin develop`)
6. Créer une Pull Request

### Règles

✅ Respecter la convention Conventional Commits  
✅ Passer tous les tests CI/CD  
✅ Documenter les nouvelles features  
✅ Ajouter des tests unitaires  
✅ Ne jamais push sur `main` directement  

---

## 📝 Licence

Ce projet est développé dans le cadre du programme EPITECH MSc Pro.

---

## 👥 Team Titans

**EPITECH MSc Pro 1 - TDEV-700**  
**Année :** 2025  
**Équipe :** Team Titans

---

## 🆘 Support

Pour toute question ou problème :

1. Consulter la [documentation backend](backend/README.md)
2. Consulter la [documentation frontend](frontend/README.md)
3. Vérifier les [issues GitHub](../../issues)
4. Contacter l'équipe de développement

---

**Made with ❤️ by Team Titans**
