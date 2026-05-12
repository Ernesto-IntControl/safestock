# SafeStock

SafeStock est une application intelligente de gestion de stock destinée aux petites et moyennes entreprises (PME).  
Le système permet d’automatiser le suivi des produits, la gestion des mouvements de stock ainsi que la surveillance des dates de péremption grâce à des alertes intelligentes et un système de scan de codes-barres.

## Contexte

Dans plusieurs PME de la ville de Kolwezi, la gestion des stocks est encore réalisée manuellement à l’aide de registres papier.  
Cette méthode entraîne :
- des erreurs de calcul,
- des pertes de données,
- des difficultés de suivi,
- des risques liés aux produits périmés.

SafeStock vise à moderniser ce processus grâce à une solution numérique centralisée.

## Objectifs du projet

- Digitaliser la gestion des stocks
- Automatiser les entrées et sorties de produits
- Scanner les produits via code-barres
- Détecter automatiquement les produits périmés
- Générer des alertes intelligentes
- Produire des statistiques et rapports
- Réduire les pertes liées aux erreurs humaines

---

# Fonctionnalités principales

## Gestion des produits
- Ajout de produits
- Modification et suppression
- Classification par catégorie
- Gestion des quantités

## Gestion des stocks
- Entrées de stock
- Sorties de stock
- Historique des mouvements
- Gestion FIFO

## Gestion des péremptions
- Calcul automatique des dates d’expiration
- Détection des produits critiques
- Alertes de péremption

## Système de scan
- Scan des codes-barres
- Identification rapide des produits

## Tableau de bord
- Vue globale des stocks
- Produits critiques
- Alertes récentes
- Statistiques

## Gestion des utilisateurs
- Authentification sécurisée
- Gestion des rôles
- Contrôle des accès

---

# Technologies utilisées

## Backend
- Node.js
- Express.js

## Frontend
- React.js

## Base de données
- MySQL

## Railway / hébergement MySQL
- Configurez un projet Railway et ajoutez un plugin MySQL.
- Copiez la valeur `DATABASE_URL` fournie par Railway dans `backend/.env` ou dans les variables d'environnement Railway.
- Assurez-vous que `JWT_SECRET` est bien défini dans `backend/.env` ou dans les variables Railway.
- En production, ne stockez pas les secrets dans `.env` committé.

### Déploiement backend
- Déployez le backend sur Railway ou un service équivalent en pointant vers `backend/src/index.js`.
- Assurez-vous d’avoir `DATABASE_URL` et `JWT_SECRET` configurés dans les variables d’environnement du service.

### Déploiement frontend
- Le frontend est prévu pour Vercel avec `vercel.json`.
- Configurez `REACT_APP_API_URL` sur Vercel avec l’URL publique du backend.

### Commandes utiles
Dans `backend` :
- `npm run db:setup` : initialise le schéma Prisma dans la base de données.
- `npm run db:push` : pousse le schéma Prisma sur la base de données.
- `npm run migrate:dev` : crée une migration de développement et met à jour la base.
- `npm run create-admin -- --email admin@example.com --password secret123 --name "Admin"` : crée un admin.

## Authentification
- JWT

## ORM
- Prisma / Sequelize

---

# Architecture du projet

```bash
safestock/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── models/
│   │   └── config/
│   │
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── layouts/
│   │
│   └── package.json
│
└── README.md