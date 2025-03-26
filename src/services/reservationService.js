const Reservation = require('../models/Reservation');

// Crear una nueva reserva con validaciones
exports.createReservation = async ({ userId, date, time }) => {
    const now = new Date();
    const selectedDate = new Date(date);

    // Validar que la fecha no sea en el pasado
    if (selectedDate < now) {
        throw new Error('No puedes reservar en una fecha pasada');
    }

    // Verificar si el usuario ya tiene una reserva en la misma fecha y hora
    const existingReservation = await Reservation.findOne({ userId, date, time });
    if (existingReservation) {
        throw new Error('Ya tienes una reserva en esta fecha y hora');
    }

    const newReservation = new Reservation({ userId, date, time, status: 'confirmed' });
    await newReservation.save();
    return newReservation;
};

// Obtener reservas de un usuario
exports.getUserReservations = async (userId) => {
    return await Reservation.find({ userId });
};

// Cancelar una reserva
exports.cancelReservation = async (reservationId, userId) => {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) throw new Error('Reserva no encontrada');
    if (reservation.userId.toString() !== userId) throw new Error('No autorizado');

    await reservation.deleteOne();
    return { msg: 'Reserva cancelada exitosamente' };
};

// Verificar disponibilidad en una fecha específica
exports.checkAvailability = async (date) => {
    const reservations = await Reservation.find({ date });
    return { date, reservedSlots: reservations.length };
};
