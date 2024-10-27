const request = require('supertest');
const app = require('../app'); // Ensure your Express app is exported
const TrainStation = require('../models/TrainStation');
const User = require('../models/User');
const mongoose = require('mongoose'); // Import mongoose

describe('Train Station API Tests', () => {
    let adminToken;
    let testStationId; // To store the ID of the created train station for tests

    beforeAll(async () => {
        // Remove all existing users before creating a new admin
        await User.deleteMany({});

        // Create an admin user for the test
        const adminUser = new User({
            email: 'admin@example.com',
            pseudo: 'admin',
            password: 'adminPassword',
            role: 'admin'
        });
        await adminUser.save();
        adminToken = adminUser.generateAuthToken();

        // Remove all existing train stations before creating a new one
        await TrainStation.deleteMany({});

        // Create a train station for tests
        const testStation = new TrainStation({
            name: 'Test Station',
            open_hour: '06:00',
            close_hour: '22:00'
        });
        await testStation.save();
        testStationId = testStation._id; // Save the ID for subsequent tests
    });

    afterAll(async () => {
        // Remove all train stations and users after tests
        await TrainStation.deleteMany({});
        await User.deleteMany({});
        await mongoose.disconnect(); // Disconnect from MongoDB
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
