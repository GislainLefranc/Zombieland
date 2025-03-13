# 📘 Project Welleat SalesSync

## 🚀 Présentation du projet  
Il est réalisé dans l'optique de servir et de maintenir la veille commerciale de l'entreprise Welleat.

---

### Frontend  
Le frontend est développé avec **React 18** et **TypeScript** pour créer des interfaces utilisateurs interactives et performantes.

### Backend  
Le backend est une **API Node.js** utilisant **Express**, **PostgreSQL** et **Sequelize**. 
Il comprend des fonctionnalités d’authentification, de gestion des utilisateurs, de sécurisation des routes et de gestion des fichiers.

---

## ✨ Fonctionnalités principales  

### Frontend  
- ⚡ **Vite** : Serveur de développement rapide et build optimisé  
- ⚛️ **React 18** : Interfaces utilisateurs modernes  
- 🛡️ **TypeScript** : Typage statique pour un code plus robuste  
- 🧹 **ESLint** & **Prettier** : Linting et formatage automatique du code  
- ✅ **Jest** & **Testing Library** : Tests unitaires et d’intégration  

### Backend  
- 🚀 **Express** : Framework minimaliste pour les API  
- 🛡️ **Helmet** et **express-rate-limit** : Sécurisation des requêtes HTTP  
- 🔑 **Passport** et **jsonwebtoken** : Authentification et gestion des tokens JWT  
- 📦 **Sequelize** : ORM pour gérer la base de données PostgreSQL  
- ✉️ **Nodemailer** : Envoi d’emails  
- 📊 **Swagger** : Documentation API interactive  

---

## 🔧 Installation  

### Frontend  
1. **Cloner le projet** et accéder au dossier frontend :  
git clone <url-du-dépôt> cd frontend


2. **Installer les dépendances** :  

npm install

3. **Lancer le serveur de développement** :  
npm run dev

L’application sera accessible à l’adresse [http://localhost:5000](http://localhost:5173).

---

### Backend  

1. **Cloner le projet** et accéder au dossier backend :  
git clone <url-du-dépôt> cd backend

2. **Installer les dépendances** :  
npm install

3. **Configurer les variables d’environnement** :  

Créer un fichier `.env` avec les variables nécessaires (voir `.env.example`).

4. **Lancer le serveur en mode développement** :  

npm run dev


5. **Lancer le serveur en mode production** :  
npm start

---

## 📂 Structure des scripts  

### Frontend  
| Script               | Description                                                      |
|----------------------|------------------------------------------------------------------|
| `npm run dev`        | 🚀 Lance le serveur de développement avec Vite                   |
| `npm run build`      | 📦 Génère une version de production                              |
| `npm run preview`    | 🔍 Prévisualise la version de production                         |
| `npm run lint`       | 🔎 Analyse le code avec ESLint                                   |
| `npm run lint:fix`   | 🛠️ Corrige les erreurs de lint automatiquement                  |
| `npm run test`       | ✅ Lance les tests avec Jest                                     |
| `npm run test:watch` | 👀 Lance les tests en mode surveillance                          |
| `npm run format`     | ✨ Formate le code avec Prettier                                 |

### Backend  
| Script               | Description                                                      |
|----------------------|------------------------------------------------------------------|
| `npm start`          | 🚀 Démarre le serveur en mode production                         |
| `npm run dev`        | 🛠️ Démarre le serveur avec Nodemon en mode développement        |
| `npm run clean`      | 🧹 Supprime le dossier `build`                                   |
| `npm run build`      | 📦 Construit l’application                                      |
| `npm run db:seed`    | 🌱 Remplit la base de données avec des données de test           |
| `npm run db:reset`   | 🔄 Réinitialise la base de données                              |
| `npm run test`       | ✅ Lance les tests avec Jest                                     |
| `npm run test:watch` | 👀 Relance les tests automatiquement                            |
| `npm run lint`       | 🔎 Analyse le code avec ESLint                                   |
| `npm run lint:fix`   | 🛠️ Corrige les erreurs de lint automatiquement                  |
| `npm run format`     | ✨ Formate le code avec Prettier                                 |
| `npm run migrate`    | 📊 Applique les migrations de base de données                    |

---

## 📦 Dépendances  

### Frontend  
- **React** & **React DOM**  
- **React Router** (`react-router-dom`)  
- **Axios** pour les requêtes HTTP  
- **Formik** & **Yup** pour la gestion et validation des formulaires  
- **Framer Motion** pour les animations  

### Backend  
- **Express** : Framework backend  
- **Sequelize** : ORM pour PostgreSQL  
- **Helmet** et **express-rate-limit** : Sécurisation des requêtes  
- **Passport** et **jsonwebtoken** : Authentification  
- **Swagger** : Documentation API interactive  
- **Nodemailer** : Envoi d’emails  
- **Winston** : Gestion des logs  

---

## 🛠️ Dépendances de développement  

- **Nodemon** : Redémarre le serveur automatiquement  
- **ESLint** et **Prettier** : Analyse et formatage du code  
- **Jest** et **Supertest** : Tests unitaires et d’intégration  
- **Cross-env** : Gestion des variables d’environnement  

---

## 🧪 Tests  
Les tests sont écrits avec **Jest** et **Supertest**.  

Pour lancer les tests :  
npm run test

Pour surveiller les fichiers et relancer les tests automatiquement :  
npm run test:watch

Pour vérifier la couverture des tests :  
npm run test:coverage

---

## 📄 Licence  
Ce projet est sous licence SAS Welleat. Veuillez consulter le fichier `LICENSE` (quand j'aurais le temps de le faire) pour plus d’informations.

---

## ✉️ Contact  
Pour toute question ou suggestion, n’hésitez pas à me contacter : **Jean-François Chaussoy**.

😊 **Bon développement !**

Jef