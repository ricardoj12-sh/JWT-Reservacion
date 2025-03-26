const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const User = require('../models/User');

let token;
let reservationId;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);

    // Asegurar usuario base
    await User.deleteOne({ email: 'test@example.com' });

    await request(app).post('/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
    });

    const loginRes = await request(app).post('/auth/login').send({
        email: 'test@example.com',
        password: 'password123'
    });

    token = loginRes.body.token;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Reservaciones', () => {
    const testDate = '2030-01-01';
    const testTime = '18:00';
    const updatedTime = '19:00';

    it('Debe permitir crear una reserva', async () => {
        const res = await request(app)
            .post('/reservations')
            .set('Authorization', `Bearer ${token}`)
            .send({ date: testDate, time: testTime });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('reservation');

        reservationId = res.body.reservation._id; // guardar ID para futuras pruebas
    });

    it('Debe rechazar reservas duplicadas para el mismo usuario y horario', async () => {
        const res = await request(app)
            .post('/reservations')
            .set('Authorization', `Bearer ${token}`)
            .send({ date: testDate, time: testTime });

        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe('Ya tienes una reserva en esta fecha y hora');
    });

    it('Debe obtener las reservas del usuario', async () => {
        const res = await request(app)
            .get('/reservations')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('Debe verificar disponibilidad de reservas en una fecha específica', async () => {
        const res = await request(app)
            .get(`/reservations/availability?date=${testDate}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('reservedSlots');
    });

    it('Debe permitir modificar una reserva existente', async () => {
        const res = await request(app)
            .put(`/reservations/${reservationId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ date: testDate, time: updatedTime });

        expect(res.statusCode).toBe(200);
        expect(res.body.reservation.time).toBe(updatedTime);
    });

    it('Debe cancelar la reserva correctamente', async () => {
        const res = await request(app)
            .delete(`/reservations/${reservationId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.msg).toBe('Reserva cancelada exitosamente');
    });

    it('Debe rechazar acceso sin token', async () => {
        const res = await request(app)
            .get('/reservations');

        expect(res.statusCode).toBe(401);
        expect(res.body.msg).toBeDefined();
    });
});
