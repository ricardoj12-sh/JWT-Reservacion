const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Registro de usuario
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 🔹 Validación del formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ msg: "Formato de email inválido" });
        }

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'El usuario ya existe' });

        user = new User({ name, email, password }); // Encriptación en User.js
        await user.save();

        res.status(201).json({ msg: 'Usuario registrado correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};


// Inicio de sesión
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("🟡 Email recibido:", email);
        console.log("🟡 Password recibido:", password);

        const user = await User.findOne({ email });
        if (!user) {
            console.log("🔴 Usuario no encontrado");
            return res.status(400).json({ msg: 'El usuario no existe' });
        }

        console.log("🟢 Usuario encontrado:", user.email);
        console.log("🔵 Contraseña en BD (Hash):", user.password);
        console.log("🔵 Comparando con la ingresada:", password);

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("🔵 bcrypt.compare() resultado:", isMatch);

        if (!isMatch) {
            console.log("🔴 Contraseña incorrecta");
            return res.status(400).json({ msg: 'Contraseña incorrecta' });
        }

        console.log("✅ Contraseña correcta, generando token...");
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error("❌ Error en login:", error);
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};
