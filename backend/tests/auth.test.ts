import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server';
import User from '../models/User';

describe('Auth API', () => {
    beforeAll(async () => {
        // Assume MONGO_URI is set for test db or use memory-server
        // For now, use the dev URI but we should be careful
    });

    afterAll(async () => {
        await User.deleteMany({ email: { $in: ['test@test.com', 'priya@test.com', 'admin_test@test.com'] } });
        await mongoose.connection.close();
    });

    it('should register a new user with all fields', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Priya Sharma',
                email: 'priya@test.com',
                password: 'password123',
                opco: 'Tensor Workshop — India',
                platform: 'BFSI',
                interests: ['AI', 'Sustainability']
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.email).toBe('priya@test.com');
        expect(res.body.role).toBe('User');
    });

    it('should register a new admin with secret', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Admin User',
                email: 'admin_test@test.com',
                password: 'password123',
                adminSecret: 'supersecret123'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.role).toBe('Admin');
    });

    it('should login the user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'priya@test.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should fail login with wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@test.com',
                password: 'wrongpassword'
            });

        expect(res.statusCode).toEqual(400);
    });
});
