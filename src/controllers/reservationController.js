const Reservation = require('../models/Reservation');
const authMiddleware = require('../middlewares/authMiddleware');

// Crear una nueva reserva con validaciones
exports.createReservation = async (req, res) => {
    try {
        const { date, time } = req.body;
        const userId = req.user.id;

        const now = new Date();
        const selectedDate = new Date(date);

        // Validar que la fecha no sea en el pasado
        if (selectedDate < now) {
            return res.status(400).json({ msg: 'No puedes reservar en una fecha pasada' });
        }

        // Validar que no exista una reserva duplicada para el mismo usuario, fecha y hora
        const existingReservation = await Reservation.findOne({ userId, date, time });
        if (existingReservation) {
            return res.status(400).json({ msg: 'Ya tienes una reserva en esta fecha y hora' });
        }

        const newReservation = new Reservation({ userId, date, time, status: 'confirmed' });
        await newReservation.save();

        res.status(201).json({ msg: 'Reserva creada exitosamente', reservation: newReservation });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};

// Obtener reservas del usuario autenticado
exports.getUserReservations = async (req, res) => {
    try {
        const userId = req.user.id;
        const reservations = await Reservation.find({ userId });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};

// Cancelar una reserva
exports.cancelReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await Reservation.findById(id);

        if (!reservation) return res.status(404).json({ msg: 'Reserva no encontrada' });
        if (reservation.userId.toString() !== req.user.id) return res.status(403).json({ msg: 'No autorizado' });

        await reservation.deleteOne();
        res.json({ msg: 'Reserva cancelada exitosamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};

// Modificar una reserva con validaciones
exports.updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, time } = req.body;
        const userId = req.user.id;

        const reservation = await Reservation.findById(id);
        if (!reservation) return res.status(404).json({ msg: 'Reserva no encontrada' });

        if (reservation.userId.toString() !== userId) {
            return res.status(403).json({ msg: 'No autorizado para modificar esta reserva' });
        }

        const now = new Date();
        const newDate = new Date(date);

        if (newDate < now) {
            return res.status(400).json({ msg: 'No puedes modificar a una fecha pasada' });
        }

        reservation.date = date || reservation.date;
        reservation.time = time || reservation.time;
        await reservation.save();

        res.json({ msg: 'Reserva actualizada exitosamente', reservation });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};

// Consultar disponibilidad de reservas en una fecha específica
exports.checkAvailability = async (req, res) => {
    try {
        const { date } = req.query;
        const reservations = await Reservation.find({ date });

        res.json({ date, reservedSlots: reservations.length });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};
