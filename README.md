[documentation.md](https://github.com/user-attachments/files/27726360/documentation.md)
  ServiceDZ — Documentation & Feuille de Route SaaS  :root { --green: #0f6e56; --green-light: #e1f5ee; --green-mid: #1d9e75; --sand: #f7f3ed; --sand-dark: #ede7db; --ink: #1a1a18; --ink-mid: #3d3d38; --ink-muted: #7a7a72; --border: #e0dbd0; --white: #ffffff; --accent: #d85a30; --accent-light: #faece7; --blue: #185fa5; --blue-light: #e6f1fb; --amber: #ba7517; --amber-light: #faeeda; --sidebar-w: 240px; --font-body: 'Plus Jakarta Sans', sans-serif; --font-display: 'DM Serif Display', serif; --font-mono: 'DM Mono', monospace; } \* { box-sizing: border-box; margin: 0; padding: 0; } body { font-family: var(--font-body); background: var(--sand); color: var(--ink); font-size: 15px; line-height: 1.7; } /\* ── Sidebar ── \*/ .sidebar { position: fixed; top: 0; left: 0; width: var(--sidebar-w); height: 100vh; background: var(--white); border-right: 1px solid var(--border); overflow-y: auto; z-index: 100; display: flex; flex-direction: column; } .sidebar-logo { padding: 24px 20px 16px; border-bottom: 1px solid var(--border); } .sidebar-logo .wordmark { font-family: var(--font-display); font-size: 22px; color: var(--green); letter-spacing: -0.5px; } .sidebar-logo .tagline { font-size: 11px; color: var(--ink-muted); margin-top: 2px; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 500; } .sidebar-section { padding: 16px 0 8px; border-bottom: 1px solid var(--border); } .sidebar-section-label { font-size: 10px; font-weight: 600; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 1px; padding: 0 20px 8px; } .sidebar-link { display: block; padding: 7px 20px; font-size: 13.5px; color: var(--ink-mid); text-decoration: none; border-left: 3px solid transparent; transition: all 0.15s; cursor: pointer; } .sidebar-link:hover, .sidebar-link.active { color: var(--green); background: var(--green-light); border-left-color: var(--green); } .sidebar-footer { margin-top: auto; padding: 16px 20px; border-top: 1px solid var(--border); font-size: 12px; color: var(--ink-muted); } .status-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: var(--green-mid); margin-right: 6px; vertical-align: middle; } /\* ── Main Content ── \*/ .main { margin-left: var(--sidebar-w); min-height: 100vh; } .section { display: none; padding: 48px 56px; max-width: 880px; } .section.active { display: block; } /\* ── Typography ── \*/ .page-eyebrow { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.2px; color: var(--green-mid); margin-bottom: 10px; } .page-title { font-family: var(--font-display); font-size: 38px; line-height: 1.15; color: var(--ink); margin-bottom: 14px; letter-spacing: -0.5px; } .page-subtitle { font-size: 16px; color: var(--ink-muted); margin-bottom: 40px; max-width: 600px; line-height: 1.6; border-bottom: 1px solid var(--border); padding-bottom: 32px; } h2 { font-family: var(--font-display); font-size: 22px; color: var(--ink); margin: 40px 0 14px; letter-spacing: -0.3px; } h3 { font-size: 14px; font-weight: 600; color: var(--ink); margin: 24px 0 10px; text-transform: uppercase; letter-spacing: 0.6px; } p { margin-bottom: 14px; color: var(--ink-mid); } /\* ── Cards ── \*/ .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin: 20px 0; } .card { background: var(--white); border: 1px solid var(--border); border-radius: 10px; padding: 18px 20px; } .card-icon { font-size: 20px; margin-bottom: 10px; } .card-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: var(--ink-muted); margin-bottom: 4px; } .card-value { font-size: 20px; font-weight: 600; color: var(--ink); letter-spacing: -0.3px; } .card-desc { font-size: 13px; color: var(--ink-muted); margin-top: 6px; } /\* ── Badges ── \*/ .badge { display: inline-block; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px; letter-spacing: 0.4px; } .badge-green { background: var(--green-light); color: var(--green); } .badge-orange { background: var(--accent-light); color: var(--accent); } .badge-blue { background: var(--blue-light); color: var(--blue); } .badge-amber { background: var(--amber-light); color: var(--amber); } .badge-gray { background: var(--sand-dark); color: var(--ink-mid); } /\* ── Code ── \*/ pre, code { font-family: var(--font-mono); font-size: 13px; } pre { background: var(--ink); color: #e8e3d8; border-radius: 8px; padding: 20px 22px; overflow-x: auto; margin: 16px 0; line-height: 1.6; } code { background: var(--sand-dark); color: var(--accent); padding: 2px 7px; border-radius: 4px; font-size: 12.5px; } pre code { background: none; color: inherit; padding: 0; font-size: 13px; } .code-comment { color: #7a7a72; } .code-key { color: #9fd3ae; } .code-val { color: #f0c87b; } .code-str { color: #f0a07c; } .code-method-get { color: #9fd3ae; font-weight: 500; } .code-method-post { color: #f0c87b; font-weight: 500; } .code-method-put { color: #f0a07c; font-weight: 500; } .code-method-del { color: #e87070; font-weight: 500; } /\* ── API Endpoint rows ── \*/ .endpoint { background: var(--white); border: 1px solid var(--border); border-radius: 8px; margin: 10px 0; overflow: hidden; } .endpoint-header { display: flex; align-items: center; gap: 12px; padding: 12px 16px; cursor: pointer; user-select: none; } .endpoint-header:hover { background: var(--sand); } .method-badge { font-family: var(--font-mono); font-size: 11px; font-weight: 500; padding: 3px 9px; border-radius: 4px; min-width: 54px; text-align: center; } .m-get { background: #e1f5ee; color: #0f6e56; } .m-post { background: #e6f1fb; color: #185fa5; } .m-put { background: #faeeda; color: #ba7517; } .m-del { background: #fcebeb; color: #a32d2d; } .endpoint-path { font-family: var(--font-mono); font-size: 13px; color: var(--ink); flex: 1; } .endpoint-desc { font-size: 13px; color: var(--ink-muted); } .endpoint-body { display: none; padding: 16px 16px 16px 16px; border-top: 1px solid var(--border); background: var(--sand); } .endpoint.open .endpoint-body { display: block; } .chevron { font-size: 13px; color: var(--ink-muted); transition: transform 0.2s; } .endpoint.open .chevron { transform: rotate(90deg); } .param-table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 8px; } .param-table th { text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.6px; color: var(--ink-muted); padding: 6px 10px; border-bottom: 1px solid var(--border); } .param-table td { padding: 8px 10px; border-bottom: 1px solid var(--border); color: var(--ink-mid); vertical-align: top; } .param-table tr:last-child td { border-bottom: none; } /\* ── Architecture boxes ── \*/ .arch-stack { display: flex; flex-direction: column; gap: 3px; margin: 20px 0; } .arch-layer { display: flex; align-items: center; gap: 12px; background: var(--white); border: 1px solid var(--border); border-radius: 7px; padding: 12px 16px; } .arch-layer-icon { width: 32px; height: 32px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; } .arch-layer-info { flex: 1; } .arch-layer-name { font-size: 14px; font-weight: 600; color: var(--ink); } .arch-layer-tech { font-size: 12px; color: var(--ink-muted); margin-top: 1px; } .arch-layer-port { font-family: var(--font-mono); font-size: 12px; color: var(--green); background: var(--green-light); padding: 3px 9px; border-radius: 4px; } /\* ── Schema fields ── \*/ .schema-model { background: var(--white); border: 1px solid var(--border); border-radius: 10px; margin: 16px 0; overflow: hidden; } .schema-model-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid var(--border); background: var(--sand); } .schema-model-name { font-family: var(--font-mono); font-size: 14px; font-weight: 500; color: var(--ink); } .schema-field { display: grid; grid-template-columns: 160px 100px 1fr; gap: 12px; padding: 9px 18px; font-size: 13px; border-bottom: 1px solid var(--border); align-items: center; } .schema-field:last-child { border-bottom: none; } .field-name { font-family: var(--font-mono); color: var(--ink); font-size: 12.5px; } .field-type { color: var(--blue); font-family: var(--font-mono); font-size: 12px; } .field-desc { color: var(--ink-muted); } /\* ── Roadmap ── \*/ .roadmap-phase { position: relative; padding-left: 28px; margin: 0 0 40px; } .roadmap-phase::before { content: ''; position: absolute; left: 10px; top: 32px; bottom: -40px; width: 1px; background: var(--border); } .roadmap-phase:last-child::before { display: none; } .phase-marker { position: absolute; left: 0; top: 0; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; } .phase-current { background: var(--green-mid); color: white; } .phase-next { background: var(--blue); color: white; } .phase-future { background: var(--sand-dark); color: var(--ink-muted); } .phase-header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; } .phase-title { font-family: var(--font-display); font-size: 19px; color: var(--ink); } .phase-timeline { font-size: 12px; color: var(--ink-muted); font-style: italic; } .feature-list { list-style: none; display: flex; flex-direction: column; gap: 8px; } .feature-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: var(--ink-mid); background: var(--white); border: 1px solid var(--border); border-radius: 7px; padding: 10px 14px; } .feature-list li::before { content: '→'; color: var(--green-mid); font-weight: 600; flex-shrink: 0; margin-top: 1px; } /\* ── Region map ── \*/ .region-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; margin: 16px 0; } .region-card { border: 1px solid var(--border); border-radius: 8px; padding: 14px 16px; background: var(--white); } .region-card.active { border-color: var(--green-mid); background: var(--green-light); } .region-name { font-size: 14px; font-weight: 600; color: var(--ink); margin-bottom: 3px; } .region-pop { font-size: 12px; color: var(--ink-muted); } .region-status { font-size: 11px; margin-top: 8px; } /\* ── Divider ── \*/ .divider { border: none; border-top: 1px solid var(--border); margin: 36px 0; } /\* ── Info box ── \*/ .info-box { border-left: 3px solid var(--green-mid); background: var(--green-light); padding: 14px 18px; border-radius: 0 7px 7px 0; margin: 20px 0; font-size: 14px; color: var(--ink-mid); } .warn-box { border-left: 3px solid var(--amber); background: var(--amber-light); padding: 14px 18px; border-radius: 0 7px 7px 0; margin: 20px 0; font-size: 14px; color: var(--ink-mid); } /\* ── DB section ── \*/ .db-tabs { display: flex; gap: 4px; margin: 20px 0 16px; border-bottom: 1px solid var(--border); } .db-tab { padding: 8px 16px; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--ink-muted); border-bottom: 2px solid transparent; margin-bottom: -1px; } .db-tab.active { color: var(--green); border-bottom-color: var(--green); } .db-panel { display: none; } .db-panel.active { display: block; } /\* ── Scrollbar ── \*/ ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; } /\* ── Print / responsive ── \*/ @media (max-width: 860px) { .sidebar { transform: translateX(-100%); } .main { margin-left: 0; } .section { padding: 32px 24px; } }

ServiceDZ

Docs & Feuille de route

Projet

Vue d'ensemble Architecture Stack technique

Backend

Référence API Base de données Authentification

Déploiement

Vercel + Homelab Variables d'env.

SaaS — Multi-région

Vision Architecture SaaS Feuille de route Régions cibles Monétisation

service-dz.vercel.app — live

ServiceDZ

Documentation complète  
& Feuille de route SaaS
================================================

ServiceDZ est une marketplace qui met en relation des clients avec des artisans (plombiers, électriciens, peintres…) en Algérie. Actuellement déployée sur la région de Tlemcen, la plateforme est en cours de transformation en SaaS multi-régions.

Statut

En ligne

service-dz.vercel.app

Région active

Tlemcen

Phase pilote

Frontend

React

Vercel · Tailwind · Framer

Backend

Node.js

Express · MongoDB · Docker

Fonctionnalités actuelles
-------------------------

*   Page d'accueil avec recherche animée et cartes de catégories dynamiques
*   Inscription / Connexion avec sélection de rôle (client ou artisan) via JWT
*   Tableau de bord Client — statistiques, missions, avis
*   Tableau de bord Artisan — gestion de profil, missions entrantes
*   Page profil publique artisan (`/artisan/:id`) — onglets, grille disponibilité, modal demande d'intervention
*   Recherche d'artisans avec filtrage par catégorie (`role: worker | artisan`)

**Bon à savoir :** le filtrage des artisans utilise `role: { $in: ['worker', 'artisan'] }` pour éviter que les comptes avec le rôle `artisan` n'apparaissent pas dans les résultats.

Infrastructure

Architecture
============

Stack distribuée : frontend sur Vercel, backend self-hosted sur Ubuntu via Docker Compose.

Couches applicatives
--------------------

🌐

React Frontend

Vercel CDN · Tailwind CSS · Framer Motion

:3000

⚡

Node.js / Express API

Docker · Ubuntu Server · JWT Auth

:5000

🍃

MongoDB

Utilisateurs · Profils · Réparations · Reviews

:27017

🗄️

Apache2 + SSL

Reverse proxy · Let's Encrypt · Tailscale VPN

:443

💾

Stockage

1 TB Ubuntu · /data/uploads · /data/backups · /data/logs

1 TB

Flux de données
---------------

    # Requête typique : client recherche un artisan
    
    Browser (Vercel)
      → GET /api/recherche?category=plomberie®ion=tlemcen
      → Apache2 (reverse proxy)
      → Express router
      → MongoDB query : { role: { $in: ['worker','artisan'] }, category: '...' }
      → JSON response → React state → UI render

Mise à jour du backend
----------------------

Un `docker-compose restart backend` seul **ne charge pas les nouvelles modifications de fichiers**. Toujours reconstruire l'image :

    docker-compose build backend
    docker-compose up -d backend

Technologie

Stack technique
===============

Détail des technologies utilisées côté frontend, backend et infrastructure.

Frontend
--------

Framework

React 18

Create React App

Styling

Tailwind CSS

Utility-first CSS

Animation

Framer Motion

Transitions & micro-anim.

Auth

JWT custom

localStorage · useAuth hook

Hébergement

Vercel

CI/CD auto sur push

Env vars

REACT\_APP\_

Préfixe obligatoire

Backend
-------

Runtime

Node.js 20

Express 4.x

Base de données

MongoDB

Mongoose ODM

Conteneur

Docker

docker-compose

Serveur

Ubuntu 24

1 TB · Apache2 · Tailscale

Dépendances principales (backend)
---------------------------------

    {
      "express": "^4.18.2",
      "mongoose": "^8.x",
      "jsonwebtoken": "^9.1.0",
      "bcrypt": "^5.1.1",
      "cors": "^2.8.5",
      "dotenv": "^16.3.1",
      "multer": "^1.4.5-lts.1"
    }

Backend

Référence API
=============

Tous les endpoints Express actifs. Base URL : `https://[server]:5000`

Auth
----

POST /api/register Créer un compte ›

Enregistre un utilisateur avec sélection du rôle client ou artisan.

Champ

Type

Description

`name`

string

Nom complet

`email`

string

Adresse email unique

`password`

string

Mot de passe (haché via bcrypt)

`role`

enum

`client` | `worker` | `artisan`

    // Réponse 201
    { "token": "eyJhbGciOiJIUzI1NiIsIn...", "user": { ... } }

POST /api/login Connexion ›

Champ

Type

Description

`email`

string

Email de l'utilisateur

`password`

string

Mot de passe en clair

    { "token": "eyJ...", "role": "client" }

Artisans
--------

GET /api/users/workers Lister tous les artisans ›

Retourne tous les utilisateurs avec `role: { $in: ['worker', 'artisan'] }`

Paramètre

Type

Description

`category`

query string

Filtrer par catégorie de métier

`region`

query string

Filtrer par région/ville SaaS

    [{ "_id": "...", "name": "Ahmed B.", "role": "artisan", "category": "plomberie" }]

GET /api/users/workers/:id Profil d'un artisan ›

Retourne le profil complet de l'artisan, utilisé par la page `/artisan/:id`.

GET /api/recherche Recherche full-text ›

Paramètre

Type

Description

`q`

string

Terme de recherche

`category`

string

Catégorie métier

Interventions
-------------

POST /api/repairs Créer une demande d'intervention ›

Champ

Type

Description

`clientId`

ObjectId

ID du client demandeur

`artisanId`

ObjectId

ID de l'artisan ciblé

`description`

string

Détail du problème

`date`

Date

Date souhaitée

    { "_id": "...", "status": "pending", "createdAt": "2025-..." }

Données

Base de données
===============

MongoDB via Mongoose. Collections principales et schémas.

Users

Repairs

Reviews

User Collection : users

\_idObjectIdIdentifiant MongoDB auto-généré

nameStringNom complet de l'utilisateur

emailStringUnique — sert d'identifiant de connexion

passwordStringHaché bcrypt (jamais retourné en clair)

roleEnum`client` | `worker` | `artisan`

categoryStringMétier (artisan only) — ex: plomberie, électricité

regionStringVille/région — champ clé SaaS

availabilityArrayCréneaux disponibles (grille horaire)

ratingNumberNote moyenne calculée depuis les reviews

createdAtDateTimestamp automatique (timestamps: true)

Pour qu'un artisan apparaisse dans les résultats de recherche, son `role` doit être `worker` ou `artisan`. La requête MongoDB utilise `{ $in: ['worker', 'artisan'] }`.

Repair Collection : repairs

\_idObjectIdIdentifiant de la demande

clientIdObjectIdRef → User (client)

artisanIdObjectIdRef → User (artisan)

descriptionStringDétail du problème décrit par le client

statusEnum`pending` | `accepted` | `in_progress` | `done` | `cancelled`

scheduledAtDateDate/heure d'intervention prévue

regionStringRégion de l'intervention — SaaS

createdAtDateDate de création

Review Collection : reviews

\_idObjectIdIdentifiant de l'avis

clientIdObjectIdAuteur de l'avis

artisanIdObjectIdArtisan évalué

repairIdObjectIdIntervention liée (optionnel)

ratingNumberNote de 1 à 5

commentStringCommentaire libre

createdAtDateDate de l'avis

Sécurité

Authentification
================

JWT custom stocké dans `localStorage`. Auth0 a été retiré suite à une incompatibilité de contexte.

Flux d'authentification
-----------------------

    # 1. Inscription / Connexion
    POST /api/register | /api/login
    → { token: "eyJ...", user: { _id, name, role } }
    
    # 2. Stockage côté client
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    
    # 3. Requêtes authentifiées
    Authorization: Bearer eyJ...
    
    # 4. Vérification backend (middleware)
    jwt.verify(token, process.env.JWT_SECRET)

Hook useAuth
------------

    // src/hooks/useAuth.js
    const useAuth = () => {
      const token = localStorage.getItem('token')
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const isAuth = !!token
      const isArtisan = ['worker', 'artisan'].includes(user.role)
      return { user, token, isAuth, isArtisan }
    }

**À faire pour le SaaS :** migrer vers des **refresh tokens** avec rotation, et stocker le JWT dans un cookie HttpOnly plutôt que localStorage pour éviter les attaques XSS.

Infrastructure

Déploiement
===========

Frontend sur Vercel, backend self-hosted sur Ubuntu Server via Docker Compose.

Frontend — Vercel
-----------------

*   Push sur `main` → build automatique et déploiement Vercel
*   Variables d'env. avec le préfixe `REACT_APP_` obligatoire pour être accessibles dans React
*   URL de production : `service-dz.vercel.app`

Backend — Docker Compose (Ubuntu)
---------------------------------

    # Démarrer tous les services
    cd /home/ubuntu/servicedz
    docker-compose up -d
    
    # Mettre à jour le backend (rebuild obligatoire)
    git pull origin main
    docker-compose build backend
    docker-compose up -d backend
    
    # Vérifier l'état
    docker-compose ps
    docker-compose logs -f backend

Accès distant via Tailscale
---------------------------

    # Sur le serveur Ubuntu
    sudo tailscale up
    tailscale ip  # → 100.y.y.y
    
    # Depuis Windows/VS Code
    ssh ubuntu@100.y.y.y
    curl http://100.y.y.y:5000/api/health

Configuration

Variables d'environnement
=========================

Récapitulatif de toutes les variables requises par environnement.

Backend — `.env` (serveur Ubuntu)
---------------------------------

    # Base de données
    MONGODB_URI=mongodb://servicedz:${MONGO_PASSWORD}@mongodb:27017/servicedz
    MONGO_PASSWORD=SecurePass456!
    
    # Auth
    JWT_SECRET=your-long-random-secret-here
    
    # CORS (séparer par virgule)
    CORS_ORIGIN=http://localhost:3000,https://service-dz.vercel.app
    
    # Serveur
    PORT=5000
    NODE_ENV=production

Frontend — Vercel Dashboard
---------------------------

    REACT_APP_API_URL=https://[votre-ip-ou-domaine]:5000
    REACT_APP_ENV=production

Frontend local — `.env.local`
-----------------------------

    REACT_APP_API_URL=http://100.y.y.y:5000
    REACT_APP_ENV=development

Ne jamais commiter `.env`, `.env.local` ou `.env.production`. Ajouter ces fichiers au `.gitignore`.

SaaS Multi-régions

Vision
======

ServiceDZ commence à Tlemcen comme pilote et s'étend progressivement aux grandes villes algériennes avec une architecture partagée et des données isolées par région.

Principe central
----------------

Une seule codebase, un seul backend déployé — mais chaque région est isolée via un champ `region` sur tous les modèles. Les artisans et clients d'Oran ne voient que les données d'Oran.

Modèle d'expansion
------------------

Phase 1 (actuelle)

Tlemcen

Pilote · Validation du modèle

Phase 2

Oran · Sidi Bel

Ouest algérien · même serveur

Phase 3

Alger · Est

Scale infra · Redis cache

Phase 4

National

Couverture complète

Ce que ça change techniquement
------------------------------

*   Ajouter le champ `region` sur les modèles `User` et `Repair` (déjà prévu dans le schéma)
*   Tous les endpoints filtrent par `region` depuis le JWT ou le query string
*   L'inscription d'un artisan inclut la sélection de sa ville/région
*   Le frontend détecte la région de l'utilisateur au login et la stocke dans le contexte auth
*   Le tableau de bord admin affiche les métriques par région

SaaS Architecture

Architecture SaaS
=================

Passage de l'architecture mono-région à une architecture multi-région sans réécriture complète.

Middleware de région
--------------------

    // middleware/region.js
    const regionMiddleware = (req, res, next) => {
      // Depuis le JWT (utilisateurs connectés)
      if (req.user?.region) {
        req.region = req.user.region
      }
      // Depuis le query string (recherche publique)
      else if (req.query.region) {
        req.region = req.query.region
      }
      // Défaut : Tlemcen (rétrocompatibilité)
      else {
        req.region = 'tlemcen'
      }
      next()
    }

Exemple : endpoint artisans avec région
---------------------------------------

    // routes/workers.js
    router.get('/api/users/workers', regionMiddleware, async (req, res) => {
      const filter = {
        role: { $in: ['worker', 'artisan'] },
        region: req.region  // ← filtre automatique
      }
      if (req.query.category) filter.category = req.query.category
      
      const workers = await User.find(filter).select('-password')
      res.json(workers)
    })

Champs à ajouter aux modèles Mongoose
-------------------------------------

    // models/User.js — ajouter
    region: {
      type: String,
      required: true,
      enum: ['tlemcen', 'oran', 'alger', 'sidi-bel-abbes', 'constantine', ...],
      default: 'tlemcen'
    }
    
    // models/Repair.js — ajouter
    region: { type: String, required: true }

Index MongoDB pour les performances
-----------------------------------

    // À créer une fois en production
    db.users.createIndex({ region: 1, role: 1, category: 1 })
    db.repairs.createIndex({ region: 1, artisanId: 1, status: 1 })

SaaS

Feuille de route
================

Quatre phases d'évolution pour transformer ServiceDZ en plateforme multi-régions robuste.

1

Fondations SaaS

En cours — 1 à 2 mois

*   Ajouter le champ `region` sur les modèles User et Repair (migration MongoDB)
*   Créer le `regionMiddleware` Express et l'appliquer à tous les routes existants
*   Ajouter la sélection de ville à l'étape d'inscription artisan et client
*   Stocker la région dans le payload JWT et dans le contexte React `useAuth`
*   Mettre à jour le frontend pour filtrer les recherches et l'affichage par région active
*   Créer les index MongoDB composés `(region, role, category)`

2

Admin Dashboard & Onboarding

Prochainement — 2 à 3 mois

*   Dashboard super-admin : métriques globales et par région (nb artisans, clients, demandes)
*   Gestion des régions : activer/désactiver une ville depuis l'admin
*   Processus de vérification artisan (upload de documents, validation manuelle ou auto)
*   Email transactionnel : confirmation inscription, demande d'intervention, rappels
*   Page de landing régionale : `/oran`, `/alger` avec contenu SEO localisé

3

Croissance & Qualité

À venir — 3 à 5 mois

*   Système de notation et avis vérifiés — lié à une intervention complétée
*   Messagerie in-app client ↔ artisan (Socket.io ou polling)
*   Notifications push / SMS pour les nouvelles demandes (Twilio ou service local)
*   Upload de photos de chantier (avant/après) dans le profil artisan — stockage `/data/uploads`
*   Recherche avancée avec filtres : disponibilité, note minimum, distance, prix
*   Redis pour le cache des résultats de recherche par région

4

Scale National

Futur — 6+ mois

*   Pipeline CI/CD GitHub Actions : tests → build → déploiement automatique
*   Monitoring Prometheus + Grafana pour les métriques serveur et applicatives
*   CDN Cloudflare pour les assets statiques et protection DDoS
*   Application mobile (React Native) — réutilisation de la logique API existante
*   Elasticsearch pour la recherche full-text rapide sur l'ensemble du catalogue

SaaS

Régions cibles
==============

Expansion progressive à partir de Tlemcen vers les grandes villes algériennes.

Vague 1 — Ouest algérien (maintenant)
-------------------------------------

Tlemcen

~1M habitants

Actif — Pilote

Oran

~1.6M habitants

Prochain

Sidi Bel Abbès

~600K habitants

Prochain

Béchar

~400K habitants

Planifié

Vague 2 — Centre (Phase 3)
--------------------------

Alger

~4M habitants

Phase 3

Blida

~600K habitants

Phase 3

Tipaza

~700K habitants

Phase 3

Vague 3 — Est (Phase 4)
-----------------------

Constantine

~1.1M habitants

Phase 4

Annaba

~700K habitants

Phase 4

Sétif

~800K habitants

Phase 4

Chaque nouvelle région ne nécessite que **zéro déploiement backend supplémentaire** — il suffit d'ajouter la valeur dans l'enum `region` du schéma Mongoose et d'activer la région dans l'interface admin.

SaaS

Monétisation
============

Modèles de revenus adaptés au marché algérien — pas de Stripe, paiements locaux privilégiés.

Modèle recommandé : freemium artisan
------------------------------------

Gratuit

Profil de base

5 demandes/mois max, pas de badge vérifié

Pro — **~1 500 DA/mois**

Artisan Pro

Demandes illimitées, badge, priorité de classement

Commission

5–8%

Sur les paiements en ligne (futur)

Paiements locaux (Algérie)
--------------------------

*   **CIB / Carte Dahabia (CCP)** — Paiement par carte bancaire algérienne via Satim
*   **Virement CCP** — Paiement manuel avec confirmation admin (court terme)
*   **Paiement en espèces à un agent** — Réseau de points de collecte locaux

Champs à ajouter au modèle User (artisans)
------------------------------------------

    subscription: {
      plan: { type: String, enum: ['free', 'pro'], default: 'free' },
      expiresAt: Date,
      requestsThisMonth: { type: Number, default: 0 },
      isVerified: { type: Boolean, default: false }
    }

Avant d'activer la monétisation : s'assurer que la densité d'artisans dans chaque région est suffisante pour que les clients trouvent des prestataires. La monétisation ne doit arriver qu'après validation du product-market fit par région.

function show(id) { document.querySelectorAll('.section').forEach(s => s.classList.remove('active')) document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active')) document.getElementById('s-' + id).classList.add('active') event.target.classList.add('active') window.scrollTo(0, 0) } function toggleEndpoint(el) { el.classList.toggle('open') } function switchTab(tab, panelId) { tab.closest('.section').querySelectorAll('.db-tab').forEach(t => t.classList.remove('active')) tab.closest('.section').querySelectorAll('.db-panel').forEach(p => p.classList.remove('active')) tab.classList.add('active') document.getElementById('tab-' + panelId).classList.add('active') }
