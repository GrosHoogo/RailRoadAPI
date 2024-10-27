const request = require('supertest');
const app = require('../app'); // Ensure the path to your app file is correct
const connectDB = require('../config'); // Correct the path if necessary
const Train = require('../models/Train');
const mongoose = require('mongoose'); // Import mongoose

let adminToken; // Admin user token

// Before all tests, connect to the database and create an admin user
beforeAll(async () => {
    await connectDB(); // Connect to the database

    // Create an admin user
    const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
            email: "admin@admin.com",
            pseudo: "admin",
            password: "admin123", 
            role: "admin"
        });

    console.log('Registration response:', registerResponse.body); // Log registration response

    // Authenticate the admin user to obtain the token
    const loginResponse = await request(app)
        .post('/api/users/login')
        .send({
            email: 'admin@admin.com',
            password: 'admin123' 
        });

    console.log('Login response:', loginResponse.body); // Log login response

    adminToken = loginResponse.body.token; // Store the token
    console.log('Admin token:', adminToken); // Log the token
});

// After each test, clean up the Train collection
afterEach(async () => {
    await Train.deleteMany();
});

// After all tests, disconnect from the database
afterAll(async () => {
    await mongoose.disconnect(); // Disconnect from MongoDB
});

// Describe tests for the Train controller
describe('Train Controller', () => {
    // Test to create a new train
    it('should create a new train', async () => {
        const newTrain = {
            name: 'Express Train',
            start_station: 'Station A',
            end_station: 'Station B',
            time_of_departure: new Date(), // Ensure this is a valid date
        };

        const response = await request(app)
            .post('/api/trains')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(newTrain);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.name).toBe(newTrain.name);
    });

    // Test to get all trains
    it('should get all trains', async () => {
        const response = await request(app)
            .get('/api/trains')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // Test to update an existing train
    it('should update an existing train', async () => {
        const train = new Train({
            name: 'Old Train',
            start_station: 'Station X',
            end_station: 'Station Y',
            time_of_departure: new Date(),
        });
        await train.save(); // Save the train to the database

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

    // Test to delete a train
    it('should delete a train', async () => {
        const train = new Train({
            name: 'Train to be deleted',
            start_station: 'Station M',
            end_station: 'Station N',
            time_of_departure: new Date(),
        });
        await train.save(); // Save the train to the database

        const response = await request(app)
            .delete(`/api/trains/${train._id}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Train deleted');
    });

    // Test to attempt deleting a non-existent train
    it('should return 404 when deleting a non-existent train', async () => {
        const response = await request(app)
            .delete('/api/trains/609c3f3d4f1f4d7b3b9c7e6a') // Use a fake ID
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Train not found');
    });
});
