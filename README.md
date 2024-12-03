# 🏓 Transcendence - The Ultimate Pong Contest Platform

**Transcendence** est une plateforme web complète qui permet aux utilisateurs de jouer à **Pong**, le jeu classique des années 70, en ligne et en temps réel. Ce projet propose une expérience utilisateur moderne avec des fonctionnalités avancées telles que la personnalisation, un chat intégré, et un système de matchmaking pour des parties compétitives. Voici une vue d’ensemble des fonctionnalités et technologies clés.

---

## 🚀 Fonctionnalités principales

### 🔐 Gestion des utilisateurs
- Authentification sécurisée via **OAuth 42**.
- Gestion des avatars (avec un avatar par défaut si non fourni).
- Système d’authentification à deux facteurs (2FA) avec Google Authenticator ou SMS.
- Ajout d’amis avec visualisation de leur statut (en ligne, hors ligne, en jeu, etc.).
- **Profil utilisateur** : historique des matchs, statistiques (victoires, défaites, niveaux de classement, succès).

### 💬 Chat interactif
- Création de **canaux de discussion** : publics, privés ou protégés par mot de passe.
- Envoi de messages privés entre utilisateurs.
- Fonctionnalité de blocage d’autres utilisateurs.
- Gestion des canaux :
  - Propriétaire du canal : peut définir/modifier un mot de passe et nommer des administrateurs.
  - Administrateurs : peuvent gérer les utilisateurs (kick, ban, mute).
- Intégration du jeu : invitation directe à des parties de Pong via le chat.

### 🕹️ Jeu Pong en temps réel
- Jeu fidèle à l’original **Pong (1972)** avec possibilité de jouer directement sur le site.
- **Système de matchmaking** : file d’attente pour trouver un adversaire.
- Options de personnalisation (cartes, power-ups, et plus encore).
- Mode par défaut sans fonctionnalités supplémentaires pour les puristes.
- Gestion des problèmes réseau (déconnexions inattendues, latence).
- Jeu **responsif**, jouable sur différentes tailles d’écran.

---

## 🛠️ Technologies utilisées

- **Backend** : [NestJS](https://nestjs.com/)
- **Frontend** : [TypeScript](https://www.typescriptlang.org/) avec le framework de ton choix.
- **Base de données** : PostgreSQL.
- **Docker** : déploiement avec une commande unique (`docker-compose up --build`).
- Sécurité :
  - Mots de passe hashés avec un algorithme robuste.
  - Protection contre les injections SQL.
  - Validation des données côté serveur.

---

## 🎨 Design et accessibilité
- Application **Single Page Application (SPA)**, compatible avec les dernières versions de **Google Chrome** et un autre navigateur moderne.
- Navigation fluide avec prise en charge des boutons *Précédent* et *Suivant* du navigateur.
- Expérience utilisateur optimisée : aucun bug ou avertissement non géré.

---

## 💡 Comment démarrer ?

1. Clonez ce dépôt.
2. Configurez vos variables d'environnement dans un fichier `.env` (non inclus dans le dépôt pour des raisons de sécurité).
3. Lancez le projet avec la commande :
   ```bash
   docker-compose up --build