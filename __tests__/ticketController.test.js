const request = require('supertest');
const app = require('../app'); // Assurez-vous que le chemin d'accès à votre fichier app est correct
const connectDB = require('../config'); // Corrigez le chemin si nécessaire
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const Train = require('../models/Train');
const mongoose = require('mongoose'); // Ajoutez cette ligne pour importer Mongoose

let adminToken; // Token de l'utilisateur admin
let userToken; // Token de l'utilisateur normal
let testTrainId; // ID du train utilisé pour les tests

// Avant tous les tests, on se connecte à la base de données et on crée un utilisateur admin et un utilisateur normal
beforeAll(async () => {
    await connectDB(); // Connexion à la base de données

    // Créer un utilisateur admin
    const registerAdminResponse = await request(app)
        .post('/api/auth/register')
        .send({
            email: 'admin@example.com',
            pseudo: 'admin',
            password: 'admin123',
            role: 'admin'
        });

    console.log('Admin registration response:', registerAdminResponse.body);

    // Authentifier l'utilisateur admin pour obtenir le token
    const loginAdminResponse = await request(app)
        .post('/api/users/login')
        .send({
            email: 'admin@example.com',
            password: 'admin123'
        });

    console.log('Admin login response:', loginAdminResponse.body);
    adminToken = loginAdminResponse.body.token;

    // Créer un utilisateur normal
    const registerUserResponse = await request(app)
        .post('/api/auth/register')
        .send({
            email: 'user@example.com',
            pseudo: 'user',
            password: 'user123',
            role: 'user'
        });

    console.log('User registration response:', registerUserResponse.body);

    // Authentifier l'utilisateur normal pour obtenir le token
    const loginUserResponse = await request(app)
        .post('/api/users/login')
        .send({
            email: 'user@example.com',
            password: 'user123'
        });

    console.log('User login response:', loginUserResponse.body);
    userToken = loginUserResponse.body.token;

    // Créer un train pour les tests
    const train = new Train({
        name: 'Test Train',
        start_station: 'Station A',
        end_station: 'Station B',
        time_of_departure: new Date() // Assurez-vous que c'est une date valide
    });
    await train.save();
    testTrainId = train._id; // Conservez l'ID du train pour les tests
});

// Après chaque test, on nettoie la collection de tickets
afterEach(async () => {
    await Ticket.deleteMany();
});

// Décrire les tests pour le contrôleur de tickets
describe('Ticket Controller', () => {
    // Test pour réserver un ticket
    it('should book a ticket for a user', async () => {
        const response = await request(app)
            .post('/api/tickets/book')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ trainId: testTrainId });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('train', testTrainId.toString());
        expect(response.body).toHaveProperty('user');
    });

    // Test pour réserver un ticket avec des données invalides
    it('should return 400 when booking a ticket with invalid data', async () => {
        const response = await request(app)
            .post('/api/tickets/book')
            .set('Authorization', `Bearer ${userToken}`)
            .send({}); // Données vides

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    // Test pour valider un ticket
    it('should validate a ticket', async () => {
        const ticket = new Ticket({
            user: new mongoose.Types.ObjectId(), // Utilisez 'new' pour instancier ObjectId
            train: testTrainId,
            isValid: false
        });
        await ticket.save(); // Enregistrer le ticket dans la base de données

        const response = await request(app)
            .put(`/api/tickets/${ticket._id}/validate`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Ticket validated');
        expect(response.body.ticket).toHaveProperty('isValid', true);
    });

    // Test pour tenter de valider un ticket inexistant
    it('should return 404 when validating a non-existent ticket', async () => {
        const response = await request(app)
            .put('/api/tickets/609c3f3d4f1f4d7b3b9c7e6a/validate') // ID fictif
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Ticket not found');
    });

    // Test pour valider un ticket sans autorisation (utilisateur normal)
    it('should return 403 when a non-employee tries to validate a ticket', async () => {
        const ticket = new Ticket({
            user: new mongoose.Types.ObjectId(), // Utilisez 'new' pour instancier ObjectId
            train: testTrainId,
            isValid: false
        });
        await ticket.save(); // Enregistrer le ticket dans la base de données

        const response = await request(app)
            .put(`/api/tickets/${ticket._id}/validate`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(403); // Accès interdit
    });
});
