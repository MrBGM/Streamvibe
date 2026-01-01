# StreamVibe - Plateforme de Streaming Vidéo

Site de streaming vidéo similaire à Netflix, développé dans le cadre d'un projet ISGE 2025.

## Description

StreamVibe est une application web complète de streaming vidéo comprenant :
- Un **frontend** responsive avec un design moderne style Netflix
- Un **backend** Node.js/Express avec MongoDB
- Système d'authentification utilisateurs et administrateurs
- Gestion des profils utilisateurs (comme Netflix)
- Lecture vidéo avec suivi de progression
- Système d'évaluations et de notes
- Panel d'administration complet

## Structure du Projet

```
streamvibe/
├── index.html              # Page d'accueil
├── login.html              # Connexion utilisateur
├── register.html           # Inscription utilisateur
├── profiles.html           # Sélection de profil
├── browse.html             # Catalogue de contenus
├── detail.html             # Détails d'un contenu
├── player.html             # Lecteur vidéo
├── watchlist.html          # Ma Liste
├── search.html             # Recherche
├── css/
│   ├── main.css            # Styles principaux
│   └── admin.css           # Styles administration
├── js/
│   ├── api/
│   │   ├── config.js       # Configuration API
│   │   └── apiService.js   # Services API
│   ├── utils/
│   │   └── helpers.js      # Fonctions utilitaires
│   ├── components/
│   │   └── ui.js           # Composants UI (toasts, modals)
│   └── pages/
│       └── home.js         # Script page d'accueil
├── admin/
│   ├── login.html          # Connexion admin
│   ├── index.html          # Dashboard admin
│   ├── contents.html       # Gestion des contenus
│   ├── upload.html         # Upload de vidéos
│   └── users.html          # Gestion des utilisateurs
└── package.json            # Configuration npm
```

## Prérequis

- **Node.js** (v14+)
- **Backend StreamVibe** démarré sur `http://localhost:5000`
- **MongoDB** connecté au backend

## Installation

1. Cloner le dépôt :
```bash
git clone <url-du-repo>
cd Streamvibe
```

2. Installer les dépendances :
```bash
npm install
```

3. Démarrer le serveur frontend :
```bash
npm start
```

Le frontend sera accessible sur `http://localhost:3000`

## Configuration

Le frontend est configuré pour se connecter au backend sur `http://localhost:5000`.
Pour modifier cette configuration, éditez le fichier `js/api/config.js` :

```javascript
const API_CONFIG = {
    BASE_URL: 'http://localhost:5000',
    API_URL: 'http://localhost:5000/api',
    ADMIN_API_URL: 'http://localhost:5000/api/admin',
    // ...
};
```

## Comptes de Test

### Utilisateur
- **Email:** test@streamvibe.com
- **Mot de passe:** password123

### Administrateur
- **Email:** admin@streamvibe.com
- **Mot de passe:** password123

## Fonctionnalités

### Utilisateurs

- **Authentification** : Inscription, connexion, déconnexion
- **Profils** : Création et gestion de profils multiples (comme Netflix)
- **Navigation** : Parcourir les contenus par catégorie, type, tendances
- **Recherche** : Recherche de films et séries
- **Lecture vidéo** : Lecteur avec contrôles complets et suivi de progression
- **Ma Liste** : Ajouter/retirer des contenus favoris
- **Évaluations** : Noter et commenter les contenus
- **Reprendre la lecture** : Continuer là où on s'est arrêté

### Administration

- **Dashboard** : Vue d'ensemble des statistiques
- **Gestion des contenus** : Créer, modifier, publier, supprimer
- **Upload vidéos** : Uploader des fichiers vidéo
- **Gestion utilisateurs** : Voir et gérer les comptes, prolonger abonnements
- **Statistiques** : Utilisateurs, revenus, vues

## API Endpoints Utilisés

### Routes Publiques
- `GET /api/contents` - Lister les contenus
- `GET /api/contents/trending` - Contenus tendance
- `GET /api/contents/new` - Nouveaux contenus
- `GET /api/contents/search?q=...` - Recherche
- `GET /api/contents/categories` - Catégories
- `GET /api/contents/:id` - Détails d'un contenu

### Routes Authentifiées (Utilisateur)
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur
- `GET /api/profiles` - Lister les profils
- `POST /api/profiles` - Créer un profil
- `POST /api/profiles/:id/select` - Sélectionner un profil
- `POST /api/history/progress` - Sauvegarder progression
- `GET /api/history/:profileId/continue` - Contenus à reprendre
- `POST /api/watchlist` - Ajouter à Ma Liste
- `POST /api/ratings` - Noter un contenu

### Routes Admin
- `POST /api/admin/auth/login` - Connexion admin
- `GET /api/admin/stats/dashboard` - Statistiques
- `GET /api/admin/contents` - Tous les contenus
- `POST /api/admin/contents` - Créer un contenu
- `PUT /api/admin/contents/:id` - Modifier un contenu
- `GET /api/admin/users` - Lister les utilisateurs
- `PUT /api/admin/users/:id/extend-subscription` - Prolonger abonnement

## Technologies Utilisées

### Frontend
- HTML5
- CSS3 (Variables CSS, Flexbox, Grid)
- JavaScript ES6+ (Vanilla JS, pas de framework)
- Design responsive

### Backend (séparé)
- Node.js / Express
- MongoDB / Mongoose
- JWT pour l'authentification
- Multer pour l'upload de fichiers

## Workflow Utilisateur

1. **Inscription/Connexion** → L'utilisateur crée un compte ou se connecte
2. **Sélection de profil** → Choix ou création d'un profil
3. **Navigation** → Parcourir les contenus (accueil, recherche, catégories)
4. **Détails** → Voir les informations d'un contenu
5. **Lecture** → Regarder la vidéo avec suivi de progression
6. **Interactions** → Ajouter à Ma Liste, noter, commenter

## Workflow Administrateur

1. **Connexion admin** → Se connecter via `/admin/login.html`
2. **Dashboard** → Vue d'ensemble des métriques
3. **Gestion contenus** → Créer/modifier/publier des films et séries
4. **Upload vidéos** → Uploader des fichiers vidéo et les associer aux contenus
5. **Gestion utilisateurs** → Voir les comptes, prolonger les abonnements

## Notes de Développement

- Le frontend est conçu pour fonctionner en local sans déploiement
- Les vidéos doivent être uploadées via l'admin ou copiées manuellement dans `/videos`
- Le chemin des vidéos dans les contenus doit être relatif : `/videos/nom-fichier.mp4`
- Pour les images (affiches, bannières), utiliser des URLs externes ou les stocker localement

## Auteur

Projet ISGE 2025 - MrBGM

## Licence

MIT
