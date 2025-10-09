# 🚀 Team Titans — Guide GitFlow & CI/CD

## 📁 Structure du projet

Ce projet est un **monorepo** contenant le **frontend (React)** et le **backend (Django)**.

```
.
├── backend/
│   ├── Dockerfile.dev
│   ├── Dockerfile.prod
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── Dockerfile.dev
│   ├── Dockerfile.prod
│   ├── package.json
│   └── package-lock.json
├── docker-compose.yml
└── .github/
    └── workflows/
        └── ci.yml
```

---

## 🌳 GitFlow — Organisation des branches

Nous utilisons **l’outil GitFlow officiel** pour gérer notre cycle de développement de manière claire et cohérente.

### 📦 Installation (une seule fois)
```bash
sudo apt install git-flow
```

### ⚙️ Initialisation du GitFlow (à faire une seule fois dans le projet)
```bash
git flow init
```

Appuyez sur **Entrée** à chaque étape (les valeurs par défaut sont parfaites) :
- Branche principale : `main`
- Branche de développement : `develop`
- Préfixes :  
  - feature/  
  - release/  
  - hotfix/  

---

## 🧩 Cycle de développement

### 🔹 Nouvelle fonctionnalité
```bash
git flow feature start nom-de-la-feature
# Exemple :
git flow feature start auth-system
```

Travaillez sur votre code, puis :
```bash
git add .
git commit -m "feat(auth): add JWT authentication"
git flow feature finish auth-system
```

Cela :
- fusionne la feature dans `develop`
- supprime la branche locale

Ensuite :
```bash
git push origin develop
```

---

### 🔹 Préparation d’une release
Quand `develop` est stable :
```bash
git flow release start v1.0.0
# Mettez à jour les numéros de version, corrigez les bugs mineurs
git add .
git commit -m "chore(release): prepare version 1.0.0"
git flow release finish v1.0.0
git push origin main develop --tags
```

---

### 🔹 Correction urgente (Hotfix)
Si un bug critique est détecté en production :
```bash
git flow hotfix start fix-login
# Corrigez le bug
git add .
git commit -m "fix(auth): correct login validation issue"
git flow hotfix finish fix-login
git push origin main develop --tags
```

---

## 🧱 Convention de Commit — Conventional Commits

Chaque commit doit suivre la norme [Conventional Commits](https://www.conventionalcommits.org/fr/v1.0.0/).

### 📜 Format :
```
<type>(scope): message court
```

### 📘 Types les plus utilisés

| Type | Description | Exemple |
|------|--------------|----------|
| `feat` | Nouvelle fonctionnalité | `feat(api): add user registration endpoint` |
| `fix` | Correction de bug | `fix(db): resolve MySQL connection error` |
| `docs` | Changement dans la documentation | `docs(readme): add GitFlow usage guide` |
| `style` | Formatage du code (indentation, espaces…) | `style(frontend): apply prettier formatting` |
| `refactor` | Amélioration du code sans changement fonctionnel | `refactor(auth): simplify token validation` |
| `test` | Ajout ou modification de tests | `test(backend): add unit tests for API routes` |
| `chore` | Maintenance, dépendances, CI/CD | `chore(ci): update GitHub Actions pipeline` |

### 💡 Scope possible :
`frontend`, `backend`, `api`, `auth`, `db`, `ci`, etc.

---

## ⚙️ CI/CD — GitHub Actions

Le pipeline CI/CD s’exécute automatiquement sur chaque **push ou pull request** vers `main` :

### 🧩 Pipeline Backend
- Installe Python et dépendances (`requirements.txt`)
- Lance les migrations et tests Django
- Construit les images Docker (`dev` et `prod`)

### 💻 Pipeline Frontend
- Installe Node.js et dépendances (`package.json`)
- Exécute les tests React
- Construit les images Docker (`dev` et `prod`)

### ✅ Règles de validation CI
Une **Pull Request** ne peut être fusionnée que si :
- Tous les tests passent  
- Les builds `frontend` et `backend` sont réussis  
- Le code respecte la convention de commits  

---

## 💬 Bonnes pratiques d’équipe

✅ Ne jamais pousser directement sur `main`  
✅ Toujours créer une branche avec `git flow feature start`  
✅ Faire des commits clairs et conformes à Conventional Commits  
✅ Laisser le CI/CD valider avant de merger  
✅ Faire des Pull Requests courtes et précises  
✅ Toujours synchroniser `develop` avant de commencer une nouvelle feature  

---

## 🧰 Exemple complet

```bash
# 1️⃣ Initialiser GitFlow (si pas déjà fait)
git flow init

# 2️⃣ Créer une nouvelle feature
git flow feature start login-ui

# 3️⃣ Travailler sur le code
git add .
git commit -m "feat(frontend): implement login UI with validation"

# 4️⃣ Finir la feature
git flow feature finish login-ui

# 5️⃣ Envoyer les changements
git push origin develop
```

---

## 🐳 Lancer le projet en local (Docker)

```bash
# Construire et démarrer les conteneurs
docker-compose up --build

# Le backend est sur : http://localhost:8000
# Le frontend est sur : http://localhost:3000
```

---

## 🧾 Résumé rapide

| Action | Commande GitFlow |
|--------|------------------|
| Nouvelle feature | `git flow feature start nom` |
| Finir une feature | `git flow feature finish nom` |
| Nouvelle release | `git flow release start vX.Y.Z` |
| Finir une release | `git flow release finish vX.Y.Z` |
| Correction critique | `git flow hotfix start nom` |
| Finir un hotfix | `git flow hotfix finish nom` |

---

🧠 **But** : avoir un développement propre, lisible et automatisé, avec un pipeline CI/CD fiable et des commits standardisés.
