const express = require('express');
const {
    createReservation,
    getUserReservations,
    cancelReservation,
    updateReservation,
    checkAvailability
} = require('../controllers/reservationController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para crear una nueva reserva
router.post('/', authMiddleware, createReservation);

// Ruta para obtener las reservas de un usuario autenticado
router.get('/', authMiddleware, getUserReservations);

// Ruta para cancelar una reserva
router.delete('/:id', authMiddleware, cancelReservation);

// Ruta para modificar una reserva
router.put('/:id', authMiddleware, updateReservation);

// Ruta para verificar disponibilidad de reservas en una fecha específica
router.get('/availability', checkAvailability);

module.exports = router;
