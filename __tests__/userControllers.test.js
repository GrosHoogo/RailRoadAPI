const request = require('supertest');
const app = require('../app'); // Assurez-vous que votre application Express est exportée
const User = require('../models/User');

describe('User API Tests', () => {
    let adminToken;
    let userToken;
    let userId; // Pour stocker l'ID de l'utilisateur créé pour les tests

    beforeAll(async () => {
        // Créez un utilisateur administrateur pour le test
        const adminUser = new User({
            email: 'admin@example.com',
            pseudo: 'admin',
            password: 'adminPassword',
            role: 'admin'
        });
        await adminUser.save();
        adminToken = adminUser.generateAuthToken();

        // Créez un utilisateur normal pour le test
        const normalUser = new User({
            email: 'testuser@example.com',
            pseudo: 'testuser',
            password: 'testPassword',
            role: 'user' // Rôle utilisateur normal
        });
        await normalUser.save();
        userToken = normalUser.generateAuthToken();
        userId = normalUser._id; // Enregistrez l'ID pour les tests suivants
    });

    afterAll(async () => {
        // Supprimez tous les utilisateurs après les tests
        await User.deleteMany({});
    });

    test('should register a new user', async () => {
        const response = await request(app)
            .post('/api/users/register')
            .send({
                email: 'newuser@example.com',
                pseudo: 'newuser',
                password: 'newPassword'
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty('email', 'newuser@example.com');
    });

    test('should login a user', async () => {
        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: 'testuser@example.com',
                password: 'testPassword'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty('email', 'testuser@example.com');
    });

    

    test('should get the profile of a normal user (user)', async () => {
        const response = await request(app)
            .get(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('pseudo', 'testuser'); // Vérifiez que seul le pseudo est renvoyé
    });

    test('should update the user profile', async () => {
        const response = await request(app)
            .put('/api/users/me')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                pseudo: 'updatedUser'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('pseudo', 'updatedUser');
    });

    test('should delete a user by admin', async () => {
        const response = await request(app)
            .delete(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'User deleted successfully');
    });
});
