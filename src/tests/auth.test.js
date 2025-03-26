const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');

let token;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);

    // Eliminar usuario si ya existe
    await User.deleteOne({ email: 'test@example.com' });

    // Crear usuario
    await request(app).post('/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
    });

    // Login y obtener token
    const loginRes = await request(app).post('/auth/login').send({
        email: 'test@example.com',
        password: 'password123'
    });

    token = loginRes.body.token;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Autenticación', () => {
    it('Debe registrar un usuario correctamente', async () => {
        await User.deleteOne({ email: 'nuevo@example.com' });

        const res = await request(app).post('/auth/register').send({
            name: 'Nuevo Usuario',
            email: 'nuevo@example.com',
            password: 'password123'
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.msg).toBe('Usuario registrado correctamente');
    });

    it('Debe iniciar sesión correctamente y devolver un token', async () => {
        const res = await request(app).post('/auth/login').send({
            email: 'test@example.com',
            password: 'password123'
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('Debe rechazar un token inválido', async () => {
        const res = await request(app)
            .get('/reservations')
            .set('Authorization', 'Bearer token_invalido');

        expect(res.statusCode).toBe(401);
        expect(res.body.msg).toBe('Token inválido o expirado');
    });
});
