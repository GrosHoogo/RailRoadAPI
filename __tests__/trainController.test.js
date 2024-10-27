const request = require('supertest');
const app = require('../app'); // Assure-toi que le chemin d'accès à ton fichier app est correct
const connectDB = require('../config'); // Corrige le chemin si nécessaire
const Train = require('../models/Train');

let adminToken; // Token de l'utilisateur admin

// Avant tous les tests, on se connecte à la base de données et on crée un utilisateur admin
beforeAll(async () => {
    await connectDB(); // Connexion à la base de données

    // Créer un utilisateur admin
    const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
            email: "admin@admin.com",
            pseudo: "admin",
            password: "admin123", 
            role: "admin"
        });

    console.log('Registration response:', registerResponse.body); // Log de la réponse d'enregistrement

    // Authentifier l'utilisateur admin pour obtenir le token
    const loginResponse = await request(app)
        .post('/api/users/login')
        .send({
            email: 'admin@admin.com',
            password: 'admin123' 
        });

    console.log('Login response:', loginResponse.body); // Log de la réponse de connexion

    adminToken = loginResponse.body.token; // Stocker le token
    console.log('Admin token:', adminToken); // Log du token
});

// Après chaque test, on nettoie la collection de trains
afterEach(async () => {
    await Train.deleteMany();
});

// Décrire les tests pour le contrôleur de train
describe('Train Controller', () => {
    // Test pour créer un nouveau train
    it('should create a new train', async () => {
        const newTrain = {
            name: 'Express Train',
            start_station: 'Station A',
            end_station: 'Station B',
            time_of_departure: new Date(), // Assure-toi que c'est une date valide
        };

        const response = await request(app)
            .post('/api/trains')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(newTrain);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.name).toBe(newTrain.name);
    });

    // Test pour obtenir tous les trains
    it('should get all trains', async () => {
        const response = await request(app)
            .get('/api/trains')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // Test pour mettre à jour un train
    it('should update an existing train', async () => {
        const train = new Train({
            name: 'Old Train',
            start_station: 'Station X',
            end_station: 'Station Y',
            time_of_departure: new Date(),
        });
        await train.save(); // Enregistrer le train dans la base de données

        const updatedTrain = {
            name: 'Updated Train',
            start_station: 'Station Z',
            end_station: 'Station W',
            time_of_departure: new Date(),
        };

        const response = await request(app)
            .put(`/api/trains/${train._id}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send(updatedTrain);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe(updatedTrain.name);
    });

    // Test pour supprimer un train
    it('should delete a train', async () => {
        const train = new Train({
            name: 'Train to be deleted',
            start_station: 'Station M',
            end_station: 'Station N',
            time_of_departure: new Date(),
        });
        await train.save(); // Enregistrer le train dans la base de données

        const response = await request(app)
            .delete(`/api/trains/${train._id}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Train deleted');
    });

    // Test pour tenter de supprimer un train inexistant
    it('should return 404 when deleting a non-existent train', async () => {
        const response = await request(app)
            .delete('/api/trains/609c3f3d4f1f4d7b3b9c7e6a') // Utilise un ID fictif
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Train not found');
    });
});
