

---

```markdown
# Persona Engine
*Activez automatiquement vos personas. Orchestrez votre vie numérique.*

Persona Engine est une application fullstack permettant d’activer automatiquement des “personas” (versions fonctionnelles d’un utilisateur) en fonction du jour de la semaine, et de déclencher des automatisations via n8n.

---

## Concept

Un utilisateur peut définir plusieurs personas :

- Étudiant
- Administratif
- Créatif
- Social

Chaque persona est automatiquement activé selon une règle temporelle :

n8n agit comme moteur d’orchestration externe :
- Détecte le jour
- Appelle l’API backend
- Déclenche des automatisations multi-services

---

## Architecture

---

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![n8n](https://img.shields.io/badge/n8n-orchestration-EA4B71?style=flat-square&logo=n8n&logoColor=white)](https://n8n.io)
[![Docker](https://img.shields.io/badge/Docker-compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docker.com)
[![License](https://img.shields.io/badge/Licence-Académique-lightgrey?style=flat-square)](./LICENSE)

</div>

---

## Sommaire

- [Concept](#-concept)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Stack technique](#-stack-technique)
- [Structure du projet](#-structure-du-projet)
- [Installation](#-installation)
- [API Reference](#-api-reference)
- [Base de données](#-base-de-données)
- [Workflow n8n](#-workflow-n8n)
- [Sécurité](#-sécurité)
- [Roadmap](#-roadmap)
- [Équipe](#-équipe)

---

## Concept

Dans un environnement numérique fragmenté, les individus jonglent quotidiennement entre plusieurs rôles : étudiant, professionnel, créatif, personne sociale. **PersonaEngine** permet de modéliser ces rôles sous forme de **personas**, et de les activer automatiquement ou manuellement selon des règles temporelles configurables.

Chaque persona regroupe :
- Des **objectifs** avec suivi de progression
- Des **routines** quotidiennes ou hebdomadaires
- Des **règles d'activation** par jour et heure
- Des **automatisations** vers des services externes

### Exemple de planning hebdomadaire

| Jour | Persona actif | Automatisations déclenchées |
|------|---------------|------------------------------|
| Lundi – Mardi | Administratif | Email Gmail + tâche Notion |
| Mercredi | Créatif | Notification Discord + Google Sheets |
| Jeudi – Vendredi | Étudiant | Événement Google Calendar + Notion |
| Samedi – Dimanche | Social | Notification Discord + Gmail |

> L'activation manuelle est toujours prioritaire sur toute règle automatique.

---

## Fonctionnalités

### Gestion des personas
- ✅ Création, modification, suppression de personas
- ✅ Personnalisation : couleur hexadécimale, icône, priorité
- ✅ Activation manuelle instantanée
- ✅ Indicateur temps réel du persona actif dans l'interface

### Règles d'activation
- ✅ Association à un ou plusieurs jours de la semaine
- ✅ Heure d'activation configurable (HH:MM)
- ✅ Activation/désactivation sans suppression (toggle)
- ✅ Résolution de conflits par priorité numérique

### Objectifs & routines
- ✅ Objectifs avec progression (0–100 %) et date d'échéance
- ✅ Routines quotidiennes ou hebdomadaires
- ✅ Activation conditionnelle (visible uniquement si persona actif)
- ✅ Statistiques de complétion sur 7, 30 et 90 jours

### Journalisation & analytics
- ✅ Historique complet des activations (source : MANUAL / N8N)
- ✅ Export CSV de l'historique filtré
- ✅ Graphiques d'activations par persona et par période
- ✅ Analyse des patterns comportementaux récurrents

### Automatisations via n8n
- ✅ Notification Discord
- ✅ Création de tâche Notion
- ✅ Ajout d'événement Google Calendar
- ✅ Envoi d'email Gmail
- ✅ Ajout d'une ligne Google Sheets

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        UTILISATEUR                          │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS + JWT
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND React 18 + Vite                  │
│              Dashboard · Personas · Analytics               │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API (Axios)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              API BACKEND  Node.js + Express                 │
│        Controller → Service → Repository → Model            │
│            JWT · Bcrypt · Helmet · Rate Limiting            │
└──────────────────────────┬──────────────────────────────────┘
                           │ ORM (Sequelize / Prisma)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      PostgreSQL 15                          │
│     Users · Personas · Rules · Objectives · Routines        │
│                 ActionLogs · Notifications                  │
└─────────────────────────────────────────────────────────────┘
                           ▲
                           │ HTTP + JWT (compte de service)
┌─────────────────────────────────────────────────────────────┐
│                    n8n  (orchestrateur)                     │
│           Cron → HTTP Request → Switch → Actions            │
└──────────────────────────┬──────────────────────────────────┘
                           │
          ┌────────────────┼─────────────────┐
          ▼                ▼                 ▼
       Discord          Notion          Google Suite
    (Webhook)        (Database)    (Calendar · Gmail · Sheets)
```

> **Principe fondamental** : n8n ne dispose d'**aucun accès direct** à la base de données. Toute communication passe exclusivement par l'API REST sécurisée.

---

## Stack technique

| Couche | Technologie | Rôle |
|--------|-------------|------|
| **Frontend** | React 18 + Vite | Interface utilisateur réactive |
| | Tailwind CSS / MUI | Design system et composants |
| | Axios | Client HTTP avec intercepteurs JWT |
| | Chart.js / Recharts | Visualisations analytiques |
| **Backend** | Node.js 18 + Express | Serveur API REST |
| | JWT + Bcrypt | Authentification et sécurité |
| | Sequelize ou Prisma | ORM et migrations |
| | Helmet + express-validator | Sécurité et validation des entrées |
| **Base de données** | PostgreSQL 15 | Persistance relationnelle (ACID) |
| **Automatisation** | n8n (self-hosted) | Orchestration et intégrations |
| **DevOps** | Docker + Docker Compose | Conteneurisation complète |
| | GitHub Actions *(optionnel)* | CI/CD |

---

## Structure du projet

```
persona-engine/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration DB, JWT, environment
│   │   ├── controllers/     # Couche HTTP (auth, persona, rule, log…)
│   │   ├── services/        # Logique métier
│   │   ├── repositories/    # Accès données via ORM
│   │   ├── models/          # Schémas Sequelize / Prisma
│   │   ├── routes/          # Définition des routes Express
│   │   ├── middlewares/     # Auth, validation, errorHandler, rateLimiter
│   │   └── utils/           # Helpers, logger, dateUtils
│   ├── tests/               # Tests unitaires et d'intégration
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Composants réutilisables (Button, Card, Chart…)
│   │   ├── pages/           # Login, Dashboard, Personas, Analytics…
│   │   ├── services/        # Appels API (authService, personaService…)
│   │   ├── context/         # AuthContext, PersonaContext
│   │   ├── hooks/           # useAuth, usePersona, useAnalytics
│   │   └── routes/          # AppRouter, PrivateRoute
│   └── Dockerfile
│
├── n8n/
│   └── workflows/           # Export JSON des workflows n8n
│
├── docker-compose.yml
└── README.md
```

---

## Installation

### Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et démarré
- [Git](https://git-scm.com/) installé

### 1. Cloner le dépôt

```bash
git clone https://github.com/<F21Sam >/persona-engine.git
cd persona-engine
```

### 2. Configurer les variables d'environnement

```bash
cp backend/.env.example backend/.env
```

Renseigner les variables dans `backend/.env` :

```env
# Base de données
DB_HOST=postgres
DB_PORT=5432
DB_NAME=persona_engine
DB_USER=postgres
DB_PASSWORD=your_secure_password

# JWT
JWT_SECRET=your_super_secret_key_minimum_32_characters
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# n8n (compte de service dédié)
N8N_SERVICE_TOKEN=your_n8n_service_jwt

# Application
NODE_ENV=development
PORT=3000
```

### 3. Lancer le projet

```bash
docker compose up --build
```

### 4. Services disponibles

| Service | URL | Notes |
|---------|-----|-------|
| **Frontend** | http://localhost:5173 | Interface React |
| **Backend API** | http://localhost:3000 | API REST |
| **API Docs** | http://localhost:3000/api-docs | Swagger UI |
| **n8n** | http://localhost:5678 | Identifiants dans `.env` |
| **PostgreSQL** | localhost:5432 | Identifiants dans `.env` |

### 5. Créer son premier compte

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "SecurePass123!"}'
```

---

## API Reference

Toutes les routes (sauf `/auth/*`) requièrent le header :

```
Authorization: Bearer <JWT_TOKEN>
```

### Authentification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/auth/register` | Création de compte. Retourne `201` + JWT. |
| `POST` | `/auth/login` | Connexion. Retourne JWT + refresh token. |
| `POST` | `/auth/refresh` | Renouvellement du JWT via refresh token. |
| `POST` | `/auth/logout` | Invalidation du refresh token. |

### Personas

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/personas` | Liste tous les personas de l'utilisateur. |
| `GET` | `/personas/active` | Retourne le persona actuellement actif. |
| `GET` | `/personas/:id` | Détail d'un persona (objectifs et routines inclus). |
| `POST` | `/personas` | Création d'un persona. |
| `PUT` | `/personas/:id` | Mise à jour d'un persona. |
| `DELETE` | `/personas/:id` | Suppression en cascade (objectifs, routines, logs). |
| `PUT` | `/personas/:id/activate` | Active un persona. Corps : `{ "source": "MANUAL" }` |

**Exemple — Activer un persona :**

```bash
curl -X PUT http://localhost:3000/personas/<UUID>/activate \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"source": "MANUAL"}'
```

```json
{
  "status": "success",
  "activatedPersona": {
    "id": "uuid-du-persona",
    "name": "Étudiant",
    "color": "#4A90E2",
    "isActive": true
  },
  "previousPersona": "Administratif",
  "logId": "uuid-du-log"
}
```

### Règles, Objectifs, Routines

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/rules` | Crée une règle d'activation. |
| `PUT` | `/rules/:id` | Modifie ou active/désactive une règle (toggle). |
| `DELETE` | `/rules/:id` | Supprime une règle. |
| `GET` | `/rules/today` | Règles actives pour le jour courant *(utilisé par n8n)*. |
| `GET` / `POST` | `/objectives` | Liste ou crée des objectifs. |
| `PUT` | `/objectives/:id/complete` | Marque un objectif comme complété. |
| `GET` / `POST` | `/routines` | Liste ou crée des routines. |
| `PUT` / `DELETE` | `/routines/:id` | Met à jour ou supprime une routine. |

### Journalisation & Analytics

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/logs` | Historique paginé. Filtres : `personaId`, `source`, `from`, `to`. |
| `GET` | `/logs/export` | Export CSV de l'historique filtré. |
| `GET` | `/analytics/activations` | Activations par persona sur une période. |
| `GET` | `/analytics/most-active` | Persona le plus actif + durée moyenne de session. |
| `GET` | `/analytics/frequency` | Distribution temporelle (heures, jours). |
| `GET` | `/analytics/completion` | Taux de complétion des objectifs et routines. |

---

## Base de données

Le schéma relationnel est composé de 7 entités normalisées :

```
users
├── id (UUID, PK)
├── name, email (UNIQUE), password (bcrypt hash)
├── role (ENUM: USER | ADMIN)
└── createdAt, updatedAt

personas
├── id (UUID, PK)
├── name, description, color (#HEX), icon, priority
├── isActive (BOOLEAN, un seul actif par utilisateur)
└── userId (FK → users.id)

activation_rules
├── id (UUID, PK)
├── dayOfWeek (INTEGER[])   -- 0=Dimanche … 6=Samedi
├── activationTime (TIME)   -- HH:MM
├── isEnabled (BOOLEAN)
└── personaId (FK → personas.id)

objectives
├── id (UUID, PK)
├── title, description, dueDate (nullable)
├── isCompleted, progressPercent (0–100)
└── personaId (FK → personas.id)

routines
├── id (UUID, PK)
├── name, frequency (ENUM: DAILY | WEEKLY)
├── days (INTEGER[])        -- pour WEEKLY uniquement
└── personaId (FK → personas.id)

action_logs
├── id (UUID, PK)
├── activationDate (TIMESTAMP ISO 8601)
├── source (ENUM: MANUAL | N8N)
├── previousPersonaId (UUID, nullable)
└── personaId (FK → personas.id)

notifications
├── id (UUID, PK)
├── type (ENUM: DISCORD | NOTION | CALENDAR | GMAIL | SHEETS)
├── message (TEXT), sentAt (TIMESTAMP)
└── personaId (FK → personas.id)
```

---

## Workflow n8n

Le workflow principal s'exécute automatiquement chaque matin à **08h00** :

```
[Cron 08:00]
     │
     ▼
[GET /rules/today]  ──►  Récupère les règles actives pour le jour courant
     │
     ▼
[Switch]  ──►  Route vers le persona correspondant (résolution par priorité)
     │
     ├──► [PUT /personas/:id/activate]  { source: "N8N" }
     │         │
     │         └──► Backend enregistre l'activation dans action_logs
     │
     └──► [Actions externes en parallèle]
               ├── Discord  : envoi d'une notification dans le canal configuré
               ├── Notion   : création d'une tâche dans la base de données
               ├── Calendar : ajout d'un événement Google Calendar
               ├── Gmail    : envoi d'un email récapitulatif
               └── Sheets   : ajout d'une ligne de log dans le tableur
```

> Les workflows sont exportés en JSON dans `n8n/workflows/` et peuvent être importés directement depuis l'interface n8n via **Settings → Import workflow**.

---

## Sécurité

| Mesure | Implémentation |
|--------|----------------|
| Authentification | JWT (access 15 min + refresh 7 j en cookie HttpOnly) |
| Mots de passe | Bcrypt avec facteur de coût 12 |
| En-têtes HTTP | Helmet.js (CSP, HSTS, X-Frame-Options, Referrer-Policy) |
| Rate limiting | 5 req/min sur `/auth/login` et `/auth/register` |
| Validation des entrées | Joi / express-validator sur tous les corps de requête |
| Isolation des données | Contrôle d'accès par ownership (userId vérifié systématiquement) |
| Variables sensibles | `.env` exclu du versioning via `.gitignore` |
| Logs applicatifs | Aucune donnée sensible (tokens, mots de passe) tracée |

---

## Roadmap

### v1.0 — MVP *(en cours)*
- [x] Architecture Docker complète (backend, frontend, PostgreSQL, n8n)
- [x] API REST avec authentification JWT + refresh tokens
- [x] Gestion CRUD complète des personas
- [x] Règles d'activation temporelles avec toggle
- [x] Workflow n8n d'activation quotidienne
- [x] Journalisation des activations (MANUAL / N8N)

### v1.1 — Expérience complète
- [ ] Interface frontend React (Dashboard, Personas, Analytics)
- [ ] Gestion des objectifs avec suivi de progression
- [ ] Gestion des routines avec statistiques de complétion
- [ ] Page Analytics avec graphiques Chart.js / Recharts

### v1.2 — Robustesse & DevOps
- [ ] Suite de tests unitaires (couverture ≥ 70 % sur la couche Service)
- [ ] Documentation Swagger complète sur `/api-docs`
- [ ] CI/CD GitHub Actions (lint, tests, build Docker)
- [ ] Export CSV de l'historique des activations

### v2.0 — Vision étendue
- [ ] Application mobile (React Native)
- [ ] Webhooks entrants pour intégrations tierces
- [ ] Partage de templates de personas entre utilisateurs
- [ ] Suggestions intelligentes de personas basées sur les patterns comportementaux

---

## Équipe

Projet réalisé dans le cadre du cursus **2MCSI — ESGI (2026)**.

Modules couverts :
- Automatisation avec n8n
- UML & Conception Fullstack
- Architecture REST & Sécurité
- Conteneurisation Docker

---

## Licence

Projet académique — ESGI 2026. Tous droits réservés.


