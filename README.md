

---

```markdown
# Persona Engine

Persona Engine est une application fullstack permettant d’activer automatiquement des “personas” (versions fonctionnelles d’un utilisateur) en fonction du jour de la semaine, et de déclencher des automatisations via n8n.

Ce projet combine :
- API REST (Node.js / Express)
- Base de données PostgreSQL
- Moteur d’orchestration n8n
- Architecture conteneurisée Docker

---

## Concept

Un utilisateur peut définir plusieurs personas :

- Étudiant
- Administratif
- Créatif
- Social

Chaque persona est automatiquement activé selon une règle temporelle :

| Jour | Persona |
|------|----------|
| Lundi - Mardi | Administratif |
| Mercredi | Créatif |
| Jeudi - Vendredi | Étudiant |
| Samedi - Dimanche | Social |

n8n agit comme moteur d’orchestration externe :
- Détecte le jour
- Appelle l’API backend
- Déclenche des automatisations multi-services

---

## Architecture

```

n8n (Cron)
↓
API Backend (Express)
↓
PostgreSQL
↓
Services externes (Discord, Gmail, Google Sheets…)

````

Principe :
- Le backend gère la logique métier et la persistance.
- n8n orchestre les déclenchements.
- Aucun accès direct à la base de données depuis n8n.

---

## Stack Technique

### Backend
- Node.js
- Express
- PostgreSQL
- pg (driver)

### Automatisation
- n8n
- Cron Node
- HTTP Request Node
- Switch Node
- Intégrations : Discord / Google / Gmail

### DevOps
- Docker
- Docker Compose

---

## Installation

### 1. Prérequis

- Docker Desktop installé
- Docker Compose activé

### 2. Lancer le projet

À la racine du projet :

```bash
docker compose up --build
````

Services disponibles :

* Backend → [http://localhost:3000](http://localhost:3000)
* n8n → [http://localhost:5678](http://localhost:5678)

  * user: admin
  * password: *****

---

## Endpoint principal

### Activer un Persona

```
PUT /activatePersona
```

Body JSON :

```json
{
  "persona": "ADMINISTRATIF"
}
```

Réponse :

```json
{
  "status": "success",
  "activatedPersona": "ADMINISTRATIF"
}
```

Chaque activation est enregistrée dans la table `action_log`.

---

## Workflow n8n

1. Cron → déclenchement quotidien
2. Détection du jour
3. Détermination du persona
4. Appel API backend
5. Déclenchement automatisations :

   * Notification Discord
   * Email Gmail
   * Log Google Sheets
   * Création tâche Notion

---

## Base de données

Table principale :

### action_log

| Champ           | Type      |
| --------------- | --------- |
| id              | SERIAL    |
| persona_name    | VARCHAR   |
| activation_date | TIMESTAMP |

---

## Choix d’architecture

Nous avons choisi une architecture découplée :

* Le backend assure la cohérence métier.
* n8n agit comme moteur d’orchestration externe.
* La conteneurisation garantit la reproductibilité de l’environnement.

---

## Roadmap

* Authentification JWT
* Gestion complète des personas
* Interface frontend React
* Règles d’activation configurables
* CI/CD GitHub Actions

---

## Équipe

Projet réalisé dans le cadre du module :

* Automatisation avec n8n
* UML & Conception Fullstack

---

## Licence

Projet académique 2MCSI ESGI – 2026

```



