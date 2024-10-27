const request = require('supertest');
const app = require('../app'); // Ensure the path to your app file is correct
const connectDB = require('../config'); // Correct the path if necessary
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const Train = require('../models/Train');
const mongoose = require('mongoose'); // Import mongoose

let adminToken; // Admin user token
let userToken; // Normal user token
let testTrainId; // ID of the train used for tests

// Before all tests, connect to the database and create an admin user and a normal user
beforeAll(async () => {
    await connectDB(); // Connect to the database

    // Create an admin user
    const registerAdminResponse = await request(app)
        .post('/api/auth/register')
        .send({
            email: 'admin@example.com',
            pseudo: 'admin',
            password: 'admin123',
            role: 'admin'
        });

    console.log('Admin registration response:', registerAdminResponse.body);

    // Authenticate the admin user to obtain the token
    const loginAdminResponse = await request(app)
        .post('/api/users/login')
        .send({
            email: 'admin@example.com',
            password: 'admin123'
        });

    console.log('Admin login response:', loginAdminResponse.body);
    adminToken = loginAdminResponse.body.token;

    // Create a normal user
    const registerUserResponse = await request(app)
        .post('/api/auth/register')
        .send({
            email: 'user@example.com',
            pseudo: 'user',
            password: 'user123',
            role: 'user'
        });

    console.log('User registration response:', registerUserResponse.body);

    // Authenticate the normal user to obtain the token
    const loginUserResponse = await request(app)
        .post('/api/users/login')
        .send({
            email: 'user@example.com',
            password: 'user123'
        });

    console.log('User login response:', loginUserResponse.body);
    userToken = loginUserResponse.body.token;

    // Create a train for tests
    const train = new Train({
        name: 'Test Train',
        start_station: 'Station A',
        end_station: 'Station B',
        time_of_departure: new Date() // Ensure this is a valid date
    });
    await train.save();
    testTrainId = train._id; // Store the train ID for tests
});

// After each test, clean up the Ticket collection
afterEach(async () => {
    await Ticket.deleteMany();
});

// After all tests, disconnect from the database
afterAll(async () => {
    await mongoose.disconnect(); // Disconnect from MongoDB
});

// Describe tests for the Ticket controller
describe('Ticket Controller', () => {
    // Test to book a ticket
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

    // Test to book a ticket with invalid data
    it('should return 400 when booking a ticket with invalid data', async () => {
        const response = await request(app)
            .post('/api/tickets/book')
            .set('Authorization', `Bearer ${userToken}`)
            .send({}); // Empty data

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    // Test to validate a ticket
    it('should validate a ticket', async () => {
        const ticket = new Ticket({
            user: new mongoose.Types.ObjectId(), // Use 'new' to instantiate ObjectId
            train: testTrainId,
            isValid: false
        });
        await ticket.save(); // Save the ticket to the database

        const response = await request(app)
            .put(`/api/tickets/${ticket._id}/validate`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Ticket validated');
        expect(response.body.ticket).toHaveProperty('isValid', true);
    });

    // Test to attempt validating a non-existent ticket
    it('should return 404 when validating a non-existent ticket', async () => {
        const response = await request(app)
            .put('/api/tickets/609c3f3d4f1f4d7b3b9c7e6a/validate') // Fake ID
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Ticket not found');
    });

    // Test to validate a ticket without authorization (normal user)
    it('should return 403 when a non-employee tries to validate a ticket', async () => {
        const ticket = new Ticket({
            user: new mongoose.Types.ObjectId(), // Use 'new' to instantiate ObjectId
            train: testTrainId,
            isValid: false
        });
        await ticket.save(); // Save the ticket to the database

        const response = await request(app)
            .put(`/api/tickets/${ticket._id}/validate`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(403); // Forbidden access
    });
});
