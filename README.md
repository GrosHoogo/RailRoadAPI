# Railroad API

Railroad API est une application Node.js qui permet de gérer un système de réservation de trains. Les utilisateurs peuvent s'inscrire, se connecter, réserver des billets, et les administrateurs peuvent gérer les utilisateurs.

## Fonctionnalités

- Inscription et connexion des utilisateurs
- Gestion des profils utilisateur (lecture, mise à jour, suppression)
- Gestion des réservations de billets de train
- Middleware d'authentification et d'autorisation
- Documentation API avec Swagger

## Technologies

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- Bcryptjs pour le hachage des mots de passe
- Swagger pour la documentation de l'API

## Dépendances

Voici les dépendances nécessaires pour faire fonctionner ce projet :

npm install express mongoose bcryptjs jsonwebtoken supertest dotenv swagger-ui-express

## Installation

1. Clonez le dépôt ou téléchargez les fichiers du projet.

2. Installez les dépendances :

    npm install

3. Créez un fichier .env à la racine du projet et ajoutez votre clé secrète JWT :

    JWT_SECRET=your_secret_key

4. Assurez-vous d'avoir MongoDB en cours d'exécution. Vous pouvez utiliser MongoDB Atlas ou installer MongoDB localement.

5. Démarrez l'application :

    npm start

6. Pour accéder à la documentation de l'API avec Swagger, ouvrez votre navigateur et allez à :

    http://localhost:3000/api-docs

## Tests

Pour exécuter les tests, utilisez Jest :

    Clear la base de données : 
        node ClearDatabase.js   
    
    Puis tester : 
        npm test -- --detectOpenHandles

    Ou tester 1 par 1 : 
        npm test -- __tests__/userControllers.test.js
        npm test -- __tests__/trainController.test.js
        npm test -- __tests__/trainStationControllers.test.js    
        npm test -- __tests__/ticketController.test.js            


