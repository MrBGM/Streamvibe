# StreamVibe API Documentation

Complete REST API documentation for the StreamVibe video streaming platform.

**Base URL:** `http://localhost:5000`
**API Prefix:** `/api`

## Table of Contents

1. [Authentication](#authentication)
2. [Public Content Routes](#public-content-routes)
3. [User Profile Routes](#user-profile-routes)
4. [Watchlist Routes](#watchlist-routes)
5. [Watch History Routes](#watch-history-routes)
6. [Rating Routes](#rating-routes)
7. [Subscription Routes](#subscription-routes)
8. [Admin Routes](#admin-routes)
9. [Data Models](#data-models)
10. [Error Handling](#error-handling)

---

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Register User
Create a new user account.

**Endpoint:** `POST /api/auth/register`
**Access:** Public

**Request Body:**
```json
{
  "email": "user@example.com",
  "mot_de_passe": "password123",
  "nom_complet": "John Doe",
  "telephone": "+33612345678",
  "type_abonnement": "standard"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Valid email address |
| mot_de_passe | string | Yes | Password (min 6 characters) |
| nom_complet | string | No | Full name |
| telephone | string | No | Phone number |
| type_abonnement | string | No | Subscription type: `basique`, `standard`, `premium` (default: `basique`) |

**Response (201):**
```json
{
  "success": true,
  "message": "Inscription réussie",
  "data": {
    "user": {
      "id": "60d5f...",
      "email": "user@example.com",
      "nom_complet": "John Doe",
      "type_abonnement": "standard",
      "statut_compte": "actif",
      "limites_partage": {
        "max_sous_utilisateurs": 3,
        "max_lectures_simultanees": 2
      },
      "date_fin_abonnement": "2025-02-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login User
Authenticate an existing user.

**Endpoint:** `POST /api/auth/login`
**Access:** Public

**Request Body:**
```json
{
  "email": "user@example.com",
  "mot_de_passe": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User
Get the authenticated user's profile.

**Endpoint:** `GET /api/auth/me`
**Access:** Protected

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "60d5f...",
    "email": "user@example.com",
    "nom_complet": "John Doe",
    "type_abonnement": "standard",
    "statut_compte": "actif",
    "limites_partage": { ... },
    "date_fin_abonnement": "2025-02-01T00:00:00.000Z"
  }
}
```

### Logout
Log out the current user.

**Endpoint:** `POST /api/auth/logout`
**Access:** Protected

**Response (200):**
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

---

## Public Content Routes

### Get All Contents
List all published content with optional filters.

**Endpoint:** `GET /api/contents`
**Access:** Public

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | Filter by type: `film`, `serie`, `documentaire` |
| genre | string | Filter by genre |
| categorie | string | Filter by category ID |
| tendance | boolean | Show only trending content |
| nouveau | boolean | Show only new releases |
| search | string | Text search in title and description |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20) |

**Response (200):**
```json
{
  "success": true,
  "count": 20,
  "total": 150,
  "page": 1,
  "pages": 8,
  "data": [
    {
      "_id": "60d5f...",
      "titre": "Inception",
      "type": "film",
      "description": "A thief who steals...",
      "annee_sortie": 2010,
      "duree_minutes": 148,
      "classification_age": "13+",
      "genres": ["Action", "Sci-Fi", "Thriller"],
      "note_moyenne": 4.5,
      "nombre_vues": 15420,
      "video_url": "http://localhost:5000/videos/inception.mp4",
      "affiche_url": "https://example.com/inception-poster.jpg",
      "categorie_ids": [{ "_id": "...", "nom": "Science Fiction", "slug": "sci-fi" }]
    },
    ...
  ]
}
```

### Get Single Content
Get detailed information about a specific content.

**Endpoint:** `GET /api/contents/:id`
**Access:** Public

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5f...",
    "titre": "Inception",
    "titre_original": "Inception",
    "type": "film",
    "description": "A thief who steals corporate secrets...",
    "synopsis_court": "Dream theft becomes reality.",
    "annee_sortie": 2010,
    "duree_minutes": 148,
    "classification_age": "13+",
    "categorie_ids": [...],
    "genres": ["Action", "Sci-Fi", "Thriller"],
    "langue_originale": "en",
    "langues_disponibles": ["en", "fr", "es"],
    "sous_titres_disponibles": ["en", "fr", "es", "de"],
    "realisateur": "Christopher Nolan",
    "producteur": "Emma Thomas",
    "acteurs": ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy"],
    "video_url": "http://localhost:5000/videos/inception.mp4",
    "affiche_url": "https://example.com/inception-poster.jpg",
    "banniere_url": "https://example.com/inception-banner.jpg",
    "bande_annonce": {
      "url": "https://youtube.com/...",
      "duree": 150
    },
    "note_moyenne": 4.5,
    "nombre_notes": 1250,
    "nombre_vues": 15420,
    "tendance": true,
    "nouveau": false,
    "recommande": true,
    "statut_publication": "publie",
    "date_publication": "2024-01-15T00:00:00.000Z"
  }
}
```

### Get Trending Content
Get popular/trending content.

**Endpoint:** `GET /api/contents/trending`
**Access:** Public

**Response (200):**
```json
{
  "success": true,
  "count": 20,
  "data": [...]
}
```

### Get New Releases
Get recently added content.

**Endpoint:** `GET /api/contents/new`
**Access:** Public

**Response (200):**
```json
{
  "success": true,
  "count": 20,
  "data": [...]
}
```

### Search Content
Search for content by text query.

**Endpoint:** `GET /api/contents/search`
**Access:** Public

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | Yes | Search query |

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "query": "inception",
  "data": [...]
}
```

### Get Categories
List all visible categories.

**Endpoint:** `GET /api/contents/categories`
**Access:** Public

**Response (200):**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "_id": "60d5f...",
      "nom": "Action",
      "slug": "action",
      "description": "Action movies and series",
      "icone": "action-icon",
      "ordre_affichage": 1,
      "visible": true,
      "nombre_contenus": 45
    },
    ...
  ]
}
```

---

## User Profile Routes

All profile routes require authentication.

### Get All Profiles
Get all profiles for the current user.

**Endpoint:** `GET /api/profiles`
**Access:** Protected

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d5f...",
      "compte_principal_id": "60d5f...",
      "nom_profil": "John",
      "avatar": "avatar1",
      "type_profil": "adulte",
      "restrictions_age": {
        "age_maximum_contenu": 18,
        "filtrage_actif": false
      },
      "genres_preferes": ["Action", "Comedy"],
      "actif": true
    },
    ...
  ]
}
```

### Create Profile
Create a new profile.

**Endpoint:** `POST /api/profiles`
**Access:** Protected

**Request Body:**
```json
{
  "nom_profil": "Kids Profile",
  "avatar": "avatar_kids",
  "type_profil": "enfant",
  "code_pin": "1234",
  "restrictions_age": {
    "age_maximum_contenu": 12,
    "filtrage_actif": true
  },
  "genres_preferes": ["Animation", "Family"]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { ... }
}
```

### Get Single Profile
Get a specific profile by ID.

**Endpoint:** `GET /api/profiles/:id`
**Access:** Protected

### Update Profile
Update a profile.

**Endpoint:** `PUT /api/profiles/:id`
**Access:** Protected

**Request Body:**
```json
{
  "nom_profil": "Updated Name",
  "avatar": "new_avatar"
}
```

### Delete Profile
Delete a profile.

**Endpoint:** `DELETE /api/profiles/:id`
**Access:** Protected

### Select Profile
Set a profile as the active profile for the session.

**Endpoint:** `POST /api/profiles/:id/select`
**Access:** Protected

**Response (200):**
```json
{
  "success": true,
  "message": "Profil sélectionné",
  "data": { ... }
}
```

---

## Watchlist Routes

All watchlist routes require authentication.

### Get Watchlist
Get all items in a profile's watchlist.

**Endpoint:** `GET /api/watchlist/:profileId`
**Access:** Protected

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d5f...",
      "contenu": {
        "_id": "60d5f...",
        "titre": "Inception",
        "type": "film",
        ...
      },
      "date_ajout": "2024-01-15T10:30:00.000Z"
    },
    ...
  ]
}
```

### Add to Watchlist
Add a content to the watchlist.

**Endpoint:** `POST /api/watchlist`
**Access:** Protected

**Request Body:**
```json
{
  "profileId": "60d5f...",
  "contentId": "60d5f..."
}
```

### Remove from Watchlist
Remove a content from the watchlist.

**Endpoint:** `DELETE /api/watchlist/:profileId/:contentId`
**Access:** Protected

### Check if in Watchlist
Check if a content is in the watchlist.

**Endpoint:** `GET /api/watchlist/:profileId/check/:contentId`
**Access:** Protected

**Response (200):**
```json
{
  "success": true,
  "inWatchlist": true
}
```

---

## Watch History Routes

All history routes require authentication.

### Get Watch History
Get the viewing history for a profile.

**Endpoint:** `GET /api/history/:profileId`
**Access:** Protected

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60d5f...",
      "contenu_id": {
        "_id": "60d5f...",
        "titre": "Inception",
        ...
      },
      "progression_secondes": 3600,
      "duree_totale_secondes": 8880,
      "pourcentage_progression": 40,
      "termine": false,
      "date_dernier_visionnage": "2024-01-15T18:30:00.000Z"
    },
    ...
  ]
}
```

### Get Continue Watching
Get content that can be resumed.

**Endpoint:** `GET /api/history/:profileId/continue`
**Access:** Protected

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "contenu": { ... },
      "progression_secondes": 3600,
      "pourcentage_progression": 40
    },
    ...
  ]
}
```

### Update Progress
Save viewing progress.

**Endpoint:** `POST /api/history/progress`
**Access:** Protected

**Request Body:**
```json
{
  "profileId": "60d5f...",
  "contentId": "60d5f...",
  "progression_secondes": 3600,
  "duree_totale_secondes": 8880,
  "termine": false,
  "appareil_utilise": "web"
}
```

### Delete from History
Remove a content from viewing history.

**Endpoint:** `DELETE /api/history/:profileId/:contentId`
**Access:** Protected

---

## Rating Routes

### Get Content Ratings
Get all ratings for a content.

**Endpoint:** `GET /api/ratings/content/:contentId`
**Access:** Public

**Response (200):**
```json
{
  "success": true,
  "data": {
    "note_moyenne": 4.5,
    "nombre_notes": 1250,
    "distribution": {
      "5": 650,
      "4": 350,
      "3": 150,
      "2": 75,
      "1": 25
    }
  }
}
```

### Rate Content
Submit a rating for a content.

**Endpoint:** `POST /api/ratings`
**Access:** Protected

**Request Body:**
```json
{
  "profileId": "60d5f...",
  "contentId": "60d5f...",
  "note": 5,
  "commentaire": "Amazing movie!"
}
```

### Get User Rating
Get the user's rating for a specific content.

**Endpoint:** `GET /api/ratings/:profileId/:contentId`
**Access:** Protected

---

## Subscription Routes

### Extend Subscription
Add 30 days to the subscription.

**Endpoint:** `POST /api/abonnement/prolonger`
**Access:** Protected

**Response (200):**
```json
{
  "success": true,
  "message": "Abonnement prolongé de 30 jours",
  "date_fin_abonnement": "2025-03-01T00:00:00.000Z"
}
```

---

## Admin Routes

All admin routes require admin authentication via `POST /api/admin/auth/login`.

### Admin Authentication

#### Admin Login
**Endpoint:** `POST /api/admin/auth/login`
**Access:** Public

**Request Body:**
```json
{
  "email": "admin@streamvibe.com",
  "mot_de_passe": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Connexion admin réussie",
  "data": {
    "admin": {
      "id": "60d5f...",
      "email": "admin@streamvibe.com",
      "nom_complet": "Admin User",
      "role": "super_admin",
      "permissions": {
        "gestion_contenu": true,
        "gestion_utilisateurs": true,
        "gestion_abonnements": true,
        "consultation_statistiques": true,
        "gestion_administrateurs": true
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Admin Profile
**Endpoint:** `GET /api/admin/auth/me`
**Access:** Admin Protected

---

### Content Management

#### Get All Contents (Admin)
Get all contents including drafts.

**Endpoint:** `GET /api/admin/contents`
**Access:** Admin Protected

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | Filter by type |
| statut_publication | string | Filter by status: `brouillon`, `publie`, `archive` |
| search | string | Text search |
| page | number | Page number |
| limit | number | Items per page |

#### Get Content by ID (Admin)
Get a single content including drafts.

**Endpoint:** `GET /api/admin/contents/:id`
**Access:** Admin Protected

#### Create Content
**Endpoint:** `POST /api/admin/contents`
**Access:** Admin Protected (gestion_contenu permission)

**Request Body:**
```json
{
  "titre": "New Movie",
  "type": "film",
  "description": "Movie description...",
  "annee_sortie": 2024,
  "duree_minutes": 120,
  "classification_age": "13+",
  "categorie_ids": ["60d5f..."],
  "genres": ["Action", "Drama"],
  "realisateur": "Director Name",
  "acteurs": ["Actor 1", "Actor 2"],
  "video_url": "http://localhost:5000/videos/movie.mp4",
  "affiche_url": "https://example.com/poster.jpg",
  "banniere_url": "https://example.com/banner.jpg"
}
```

#### Update Content
**Endpoint:** `PUT /api/admin/contents/:id`
**Access:** Admin Protected (gestion_contenu permission)

#### Delete Content
Archives the content (soft delete).

**Endpoint:** `DELETE /api/admin/contents/:id`
**Access:** Admin Protected (gestion_contenu permission)

#### Publish Content
**Endpoint:** `PUT /api/admin/contents/:id/publish`
**Access:** Admin Protected (gestion_contenu permission)

---

### Video Upload

#### Upload Video
Upload a video file.

**Endpoint:** `POST /api/admin/upload-video`
**Access:** Admin Protected
**Content-Type:** `multipart/form-data`

**Form Data:**
| Field | Type | Description |
|-------|------|-------------|
| video | file | Video file (mp4, avi, mkv, mov) - Max 500MB |

**Response (200):**
```json
{
  "success": true,
  "message": "Vidéo uploadée avec succès",
  "data": {
    "filename": "1704067200000-abc123-movie.mp4",
    "originalName": "movie.mp4",
    "url": "http://localhost:5000/videos/1704067200000-abc123-movie.mp4",
    "size": 524288000,
    "mimetype": "video/mp4"
  }
}
```

#### List Videos
Get all uploaded videos.

**Endpoint:** `GET /api/admin/videos`
**Access:** Admin Protected

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "filename": "1704067200000-abc123-movie.mp4",
      "url": "http://localhost:5000/videos/1704067200000-abc123-movie.mp4",
      "size": 524288000,
      "uploadedAt": "2024-01-01T00:00:00.000Z"
    },
    ...
  ]
}
```

#### Delete Video
Delete an uploaded video file.

**Endpoint:** `DELETE /api/admin/videos/:filename`
**Access:** Admin Protected

---

### User Management

#### Get All Users
**Endpoint:** `GET /api/admin/users`
**Access:** Admin Protected (gestion_utilisateurs permission)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| type_abonnement | string | Filter by subscription type |
| statut_compte | string | Filter by account status |
| search | string | Search in email or name |
| page | number | Page number |
| limit | number | Items per page |

#### Get User Details
**Endpoint:** `GET /api/admin/users/:id`
**Access:** Admin Protected (gestion_utilisateurs permission)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "profiles": [...],
    "stats": {
      "nombre_profils": 3,
      "contenus_visionnes": 45
    }
  }
}
```

#### Suspend User
**Endpoint:** `PUT /api/admin/users/:id/suspend`
**Access:** Admin Protected (gestion_utilisateurs permission)

#### Activate User
**Endpoint:** `PUT /api/admin/users/:id/activate`
**Access:** Admin Protected (gestion_utilisateurs permission)

#### Extend Subscription
**Endpoint:** `PUT /api/admin/users/:id/extend-subscription`
**Access:** Admin Protected (gestion_abonnements permission)

**Request Body:**
```json
{
  "jours": 30
}
```

---

### Category Management

#### Create Category
**Endpoint:** `POST /api/admin/categories`
**Access:** Admin Protected (gestion_contenu permission)

**Request Body:**
```json
{
  "nom": "Horror",
  "slug": "horror",
  "description": "Horror movies and series",
  "icone": "horror-icon",
  "ordre_affichage": 5,
  "visible": true
}
```

#### Update Category
**Endpoint:** `PUT /api/admin/categories/:id`
**Access:** Admin Protected (gestion_contenu permission)

#### Delete Category
**Endpoint:** `DELETE /api/admin/categories/:id`
**Access:** Admin Protected (gestion_contenu permission)

---

### Statistics

#### Dashboard Stats
Get overview statistics.

**Endpoint:** `GET /api/admin/stats/dashboard`
**Access:** Admin Protected (consultation_statistiques permission)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "utilisateurs": {
      "total": 1500,
      "actifs": 1200,
      "suspendus": 50,
      "nouveaux_7j": 45
    },
    "contenus": {
      "total": 500,
      "publies": 450,
      "brouillons": 50
    },
    "abonnements": [
      { "_id": "basique", "count": 500 },
      { "_id": "standard", "count": 600 },
      { "_id": "premium", "count": 400 }
    ],
    "top_contenus": [...],
    "vues_totales": 250000
  }
}
```

#### Revenue Stats
Get revenue statistics.

**Endpoint:** `GET /api/admin/stats/revenue`
**Access:** Admin Protected (consultation_statistiques permission)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "revenu_mensuel_estime": 8500000,
    "revenu_annuel_estime": 102000000,
    "repartition": {
      "basique": 1500000,
      "standard": 3000000,
      "premium": 4000000
    },
    "nombre_abonnes_actifs": 1200
  }
}
```

---

### Administrator Management

#### Create Administrator
**Endpoint:** `POST /api/admin/administrators`
**Access:** Super Admin only

**Request Body:**
```json
{
  "email": "newadmin@streamvibe.com",
  "mot_de_passe": "securepassword",
  "nom_complet": "New Admin",
  "role": "admin_contenu",
  "permissions": {
    "gestion_contenu": true,
    "gestion_utilisateurs": false,
    "gestion_abonnements": false,
    "consultation_statistiques": true,
    "gestion_administrateurs": false
  }
}
```

#### List Administrators
**Endpoint:** `GET /api/admin/administrators`
**Access:** Super Admin only

---

## Data Models

### User
| Field | Type | Description |
|-------|------|-------------|
| email | string | User email (unique) |
| mot_de_passe | string | Hashed password |
| nom_complet | string | Full name |
| telephone | string | Phone number |
| type_abonnement | enum | `basique`, `standard`, `premium` |
| statut_compte | enum | `actif`, `suspendu`, `resilie`, `en_attente` |
| date_debut_abonnement | date | Subscription start date |
| date_fin_abonnement | date | Subscription end date |
| limites_partage | object | Profile and stream limits |

### Content
| Field | Type | Description |
|-------|------|-------------|
| titre | string | Title |
| titre_original | string | Original title |
| type | enum | `film`, `serie`, `documentaire` |
| description | string | Full description |
| synopsis_court | string | Short synopsis (max 200 chars) |
| annee_sortie | number | Release year (1900-2100) |
| duree_minutes | number | Duration in minutes |
| classification_age | enum | `G`, `PG`, `7+`, `13+`, `16+`, `18+`, `Tous publics` |
| categorie_ids | ObjectId[] | Category references |
| genres | string[] | Genre list |
| langue_originale | string | Original language code |
| langues_disponibles | string[] | Available languages |
| sous_titres_disponibles | string[] | Available subtitles |
| realisateur | string | Director |
| producteur | string | Producer |
| acteurs | string[] | Cast list |
| video_url | string | Video file URL |
| affiche_url | string | Poster image URL |
| banniere_url | string | Banner image URL |
| bande_annonce | object | Trailer info (url, duree) |
| note_moyenne | number | Average rating (0-5) |
| nombre_notes | number | Number of ratings |
| nombre_vues | number | View count |
| tendance | boolean | Is trending |
| nouveau | boolean | Is new release |
| recommande | boolean | Is recommended |
| statut_publication | enum | `brouillon`, `publie`, `archive` |

### Profile
| Field | Type | Description |
|-------|------|-------------|
| compte_principal_id | ObjectId | Parent user reference |
| nom_profil | string | Profile name |
| avatar | string | Avatar identifier |
| type_profil | enum | `adulte`, `enfant` |
| code_pin | string | 4-digit PIN |
| restrictions_age | object | Age restrictions settings |
| genres_preferes | string[] | Preferred genres |

### Admin
| Field | Type | Description |
|-------|------|-------------|
| email | string | Admin email (unique) |
| mot_de_passe | string | Hashed password |
| nom_complet | string | Full name |
| role | enum | `super_admin`, `admin_contenu`, `admin_support`, `moderateur` |
| permissions | object | Permission flags |
| statut | enum | `actif`, `suspendu`, `inactif` |
| dernier_connexion | date | Last login timestamp |

---

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions or expired subscription |
| 404 | Not Found |
| 500 | Server Error |

### Common Errors

**401 - Unauthorized:**
```json
{
  "success": false,
  "message": "Identifiants incorrects"
}
```

**403 - Subscription Expired:**
```json
{
  "success": false,
  "message": "Votre abonnement a expiré"
}
```

**403 - Permission Denied:**
```json
{
  "success": false,
  "message": "Permission refusée"
}
```

**404 - Not Found:**
```json
{
  "success": false,
  "message": "Contenu non trouvé"
}
```

---

## Utility Endpoints

### Health Check
**Endpoint:** `GET /api/health`
**Access:** Public

**Response (200):**
```json
{
  "success": true,
  "database": "connected",
  "uptime": 3600.5,
  "memory": { ... },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### API Stats
**Endpoint:** `GET /api/stats`
**Access:** Public

**Response (200):**
```json
{
  "success": true,
  "collections": {
    "comptes_principaux": 1500,
    "sous_utilisateurs": 3500,
    "contenus": 500,
    "categories": 8
  },
  "total_collections": 4
}
```

### API Test
**Endpoint:** `GET /api/test`
**Access:** Public

**Response (200):**
```json
{
  "success": true,
  "message": "API StreamVibe complète et fonctionnelle!",
  "version": "1.0.0",
  "routes": {
    "auth": "/api/auth",
    "profiles": "/api/profiles",
    "contents": "/api/contents",
    "history": "/api/history",
    "watchlist": "/api/watchlist",
    "ratings": "/api/ratings",
    "admin": "/api/admin"
  }
}
```

---

## Video Files

Uploaded videos are served statically at:
```
GET /videos/:filename
```

Example: `http://localhost:5000/videos/1704067200000-abc123-movie.mp4`

---

## Test Accounts

### User Account
- **Email:** test@streamvibe.com
- **Password:** password123

### Admin Account
- **Email:** admin@streamvibe.com
- **Password:** password123
