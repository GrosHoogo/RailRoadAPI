// clearDatabase.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Ticket = require('./models/Ticket'); // Assurez-vous que le chemin est correct
const Train = require('./models/Train'); // Assurez-vous que le chemin est correct
const TrainStation = require('./models/TrainStation'); // Assurez-vous que le chemin est correct
const User = require('./models/User'); // Assurez-vous que le chemin est correct

// Charger les variables d'environnement
dotenv.config();

// Connecter à MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1);
    }
};

// Fonction pour supprimer les documents des collections
const clearDatabase = async () => {
    try {
        await Ticket.deleteMany({});
        console.log('All tickets deleted');

        await Train.deleteMany({});
        console.log('All trains deleted');

        await TrainStation.deleteMany({});
        console.log('All train stations deleted');

        await User.deleteMany({});
        console.log('All users deleted');
    } catch (error) {
        console.error('Error clearing database:', error);
    } finally {
        mongoose.connection.close(); // Fermer la connexion à MongoDB
    }
};

// Exécuter le script
const run = async () => {
    await connectDB(); // Connecter à la base de données
    await clearDatabase(); // Effacer les données
};

// Lancer le script
run();
