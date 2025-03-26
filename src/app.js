const express = require('express');
const connectDB = require('./config/database');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

// Configurar variables de entorno
dotenv.config();

// Inicializar la aplicación
const app = express();

// Conectar a la base de datos
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Demasiadas solicitudes desde esta IP, por favor intenta más tarde'
});
app.use(limiter);

// Rutas
app.use('/auth', authRoutes);
app.use('/reservations', reservationRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.send('API de Reservaciones en funcionamiento 🚀');
});

// ✅ Exportar app para usar en tests con Supertest
module.exports = app;

// ✅ Solo escuchar el puerto si se ejecuta directamente (no en tests)
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
}
