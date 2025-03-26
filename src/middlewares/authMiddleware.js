const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware para verificar el token JWT
module.exports = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ msg: 'Acceso denegado. No hay token proporcionado' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);

        // Validar si el token ha expirado
        if (decoded.exp * 1000 < Date.now()) {
            return res.status(401).json({ msg: 'Token expirado. Inicia sesión nuevamente' });
        }

        req.user = decoded;
        next(); // Continúa con la siguiente función en la ruta
    } catch (error) {
        res.status(401).json({ msg: 'Token inválido o expirado', error: error.message });
    }
};
