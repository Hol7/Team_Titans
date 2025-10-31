# Application Frontend

Votre application permet aux employés d'enregistrer leurs arrivées et départs, et aux managers de gérer les équipes et de visualiser les indicateurs clés de performance (KPI) des membres de l'entreprise. Elle se compose de deux principaux composants :

- **Application Backend** : Contient toute la logique métier et les fonctionnalités, implémentée sous forme d'une API RESTful.
- **Client Frontend** : Une application mobile ou web qui interagit avec l'API backend.

L'application doit gérer les employés au sein des équipes et traiter les plannings avec précision pour éviter les erreurs dans les heures de travail, qui pourraient entraîner des problèmes opérationnels tels que des grèves.

## API Backend

Le backend doit être exclusivement une **API RESTful**, servant de noyau à l'application. Il gère toute la logique métier et la gestion des données.

### Contenu Utilisateur

L'API enregistre les informations des utilisateurs, y compris :

- Prénom
- Nom
- Email
- Numéro de téléphone

### Contenu Équipe

L'API enregistre les informations des équipes, y compris :

- Nom
- Description
- Membres
- Manager

### Routes et Endpoints de l'API

Implémentez au minimum les endpoints suivants pour couvrir les fonctionnalités de gestion des utilisateurs, des équipes, du temps, des rapports, de l'authentification et du profil personnel :

- `POST /login` : Authentifie un utilisateur en utilisant ses identifiants (email et mot de passe). Retourne un jeton d'authentification (par exemple, JWT) pour les requêtes ultérieures. Accessible à tous les utilisateurs (employés et managers).
- `GET /me` : Récupère les informations personnelles de l'utilisateur connecté (prénom, nom, email, numéro de téléphone). Requiert un jeton d'authentification.
- `PUT /me` : Met à jour les informations personnelles de l'utilisateur connecté (prénom, nom, email, numéro de téléphone). Requiert un jeton d'authentification.
- `DELETE /me` : Supprime le compte de l'utilisateur connecté. Requiert un jeton d'authentification.
- `GET /users` : Récupère la liste de tous les utilisateurs (accessible uniquement aux managers pour la liste complète ; les employés ne peuvent voir que leurs propres informations via `/me`).
- `POST /users` : Ajoute un nouvel utilisateur (restreint aux managers). Requiert des données telles que prénom, nom, email, numéro de téléphone et mot de passe initial.
- `PUT /users/{id}` : Met à jour les informations d'un utilisateur spécifique (prénom, nom, email, numéro de téléphone). Accessible aux managers pour tous les utilisateurs, et à l'utilisateur lui-même via `/me`.
- `DELETE /users/{id}` : Supprime un utilisateur spécifique (restreint aux managers ; les utilisateurs peuvent supprimer leur propre compte via `/me`).
- `GET /teams` : Récupère la liste de toutes les équipes, incluant leurs noms, descriptions, membres et managers. Accessible à tous les utilisateurs, mais les employés ne voient que les équipes dont ils sont membres.
- `POST /teams` : Ajoute une nouvelle équipe (restreint aux managers). Requiert un nom, une description et une liste initiale de membres.
- `PUT /teams/{id}` : Met à jour les informations d'une équipe spécifique (nom, description, membres, manager ; restreint aux managers).
- `DELETE /teams/{id}` : Supprime une équipe spécifique (restreint aux managers).
- `POST /clocks` : Enregistre l'arrivée ou le départ de l'utilisateur authentifié. Requiert un jeton d'authentification et un type d'événement (arrivée ou départ).
- `GET /users/{id}/clocks` : Récupère un résumé des arrivées et départs d'un employé spécifique (accessible aux managers pour leurs équipes, et à l'employé pour ses propres données).
- `GET /reports` : Récupère un rapport global basé sur les KPI sélectionnés (par exemple, heures travaillées, moyennes horaires ; restreint aux managers).
- `GET /teams/{id}/reports` : Récupère les moyennes des heures quotidiennes et hebdomadaires d'une équipe sur une période donnée (restreint aux managers). Inclut des données agrégées comme la moyenne des heures travaillées par membre.
- `GET /users/{id}/reports` : Récupère les heures de travail quotidiennes et hebdomadaires d'un employé spécifique sur une période donnée (restreint aux managers ou à l'employé pour ses propres données).

> **Note** : Tous les endpoints nécessitent une authentification par jeton, sauf `POST /login`. Les accès sont restreints selon les rôles (employés ou managers) pour garantir la sécurité et la confidentialité des données.

## Interfaces Frontend

Le frontend doit implémenter les vues suivantes, en interaction avec l'API backend :

- **Authentification :**
  - Connexion

- **Utilisateurs :**
  - Récupérer les utilisateurs (liste complète réservée aux managers)
  - Ajouter un utilisateur (réservé aux managers)
  - Mettre à jour un utilisateur
  - Supprimer un utilisateur

- **Équipes :**
  - Récupérer les équipes
  - Ajouter une équipe (réservé aux managers)
  - Mettre à jour une équipe (réservé aux managers)
  - Supprimer une équipe (réservé aux managers)

- **Gestion du temps :**
  - Enregistrer l'arrivée/départ de l'utilisateur authentifié
  - Visualiser un résumé des arrivées et départs d'un employé
  - Récupérer les arrivées et départs

- **KPI :**
  - Visualiser un rapport global basé sur les KPI choisis (réservé aux managers)

## Rôles et Sécurité

L'application cible deux rôles : **employés** et **managers**, chacun ayant un accès spécifique aux fonctionnalités. La sécurité doit être appliquée pour restreindre l'accès aux utilisateurs autorisés uniquement, nécessitant une authentification pour toutes les interactions.

### Mécanismes d'Authentification

Implémentez les éléments suivants :

- Méthode d'authentification des utilisateurs
- Gestion des mots de passe
- Sécurité basée sur des jetons

### Fonctionnalités Basées sur les Rôles

#### Fonctionnalités Communes (Employés et Managers) :

- Modifier les informations du compte (prénom, nom, email, numéro de téléphone)
- Supprimer leur compte
- Signaler les heures d'arrivée et de départ
- Visualiser leurs tableaux de bord personnels

#### Fonctionnalités Réservées aux Managers :

- Créer de nouveaux comptes d'employés (les employés ne peuvent pas créer de comptes)
- Gérer les équipes (ajouter, mettre à jour, supprimer des équipes et assigner des membres)
- Visualiser les moyennes des heures quotidiennes et hebdomadaires de leur équipe sur une période donnée
- Visualiser les heures de travail quotidiennes et hebdomadaires d'un employé sur une période
- Visualiser les tableaux de bord de leurs employés

> **Note** : Les managers ont l'autorité exclusive de créer des comptes d'employés, garantissant un contrôle de l'intégration. La liste des fonctionnalités n'est pas exhaustive ; des fonctionnalités ou tableaux de bord supplémentaires pertinents peuvent être ajoutés.

## Sensibilisation à l'UX et à l'Accessibilité

Pour garantir que l'application soit utilisable par tous les utilisateurs, quel que soit le contexte, l'appareil ou les capacités, intégrez de **bonnes pratiques d'UX (expérience utilisateur)** et d'**accessibilité** tout au long du projet. Construire une interface accessible et utilisable est crucial pour la **qualité, l'inclusion et l'efficacité**.

### Pourquoi c'est important

- Une expérience utilisateur claire et cohérente augmente l'adoption et réduit les erreurs.
- L'accessibilité garantit l'utilisabilité pour les personnes ayant des handicaps (visuels, moteurs, auditifs, cognitifs).
- Améliore le **SEO**, l'**utilisabilité** et la **perception globale de la qualité**.

## Considérations de Développement

- **Flux Employés et Managers** : Assurez-vous que les managers ont un contrôle exclusif sur la création des employés et la gestion des équipes, tandis que les employés ne peuvent gérer que leur propre temps et visualiser leurs tableaux de bord.
- **Précision des plannings** : Développez la logique de gestion du temps avec soin pour éviter les erreurs dans les heures de travail, qui pourraient entraîner des perturbations opérationnelles telles que des grèves.
- **Sécurité** : Protégez toutes les requêtes API avec une authentification et un contrôle d'accès basé sur les rôles pour empêcher tout accès non autorisé.