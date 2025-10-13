This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Tout d’abord, exécutez le serveur de développement 

**Node version : v22**

```bash
# install dependencies
npm install
# run development server
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Ouvrez [http://localhost:3030](http://localhost:3030) avec votre navigateur pour voir le résultat.

# Application Frontend

Votre application permet aux employés d'enregistrer leurs arrivées et départs, et aux managers de gérer les équipes et de visualiser les indicateurs clés de performance (KPI) des membres de l'entreprise. Elle se compose de deux principaux composants :

- **Application Backend** : Contient toute la logique métier et les fonctionnalités, implémentée sous forme d'une API RESTful.
- **Client Frontend** : Une application mobile ou web qui interagit avec l'API backend.

L'application doit gérer les employés au sein des équipes et traiter les plannings avec précision pour éviter les erreurs dans les heures de travail, qui pourraient entraîner des problèmes opérationnels tels que des grèves.


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