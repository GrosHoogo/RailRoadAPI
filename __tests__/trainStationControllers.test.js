const request = require('supertest');
const app = require('../app'); // Assurez-vous que votre application Express est exportée
const TrainStation = require('../models/TrainStation');
const User = require('../models/User');

describe('Train Station API Tests', () => {
    let adminToken;
    let testStationId; // Pour stocker l'ID de la gare créée pour les tests

    beforeAll(async () => {
        // Créer un utilisateur administrateur pour le test
        const adminUser = new User({
            email: 'admin@example.com',
            pseudo: 'admin',
            password: 'adminPassword',
            role: 'admin'
        });
        await adminUser.save();
        adminToken = adminUser.generateAuthToken();

        // Créer une gare pour les tests
        const testStation = new TrainStation({
            name: 'Test Station',
            open_hour: '06:00',
            close_hour: '22:00'
        });
        await testStation.save();
        testStationId = testStation._id; // Enregistrez l'ID pour les tests suivants
    });

    afterAll(async () => {
        // Supprimez toutes les gares et utilisateurs après les tests
        await TrainStation.deleteMany({});
        await User.deleteMany({});
    });

    test('should get all train stations', async () => {
        const response = await request(app)
            .get('/api/trainstations');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    test('should create a new train station (admin only)', async () => {
        const response = await request(app)
            .post('/api/trainstations')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'New Train Station',
                open_hour: '08:00',
                close_hour: '20:00'
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('name', 'New Train Station');
    });

    test('should update a train station (admin only)', async () => {
        const response = await request(app)
            .put(`/api/trainstations/${testStationId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Updated Station',
                open_hour: '07:00',
                close_hour: '21:00'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name', 'Updated Station');
    });

    test('should delete a train station (admin only)', async () => {
        const response = await request(app)
            .delete(`/api/trainstations/${testStationId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Station deleted');
    });
});
