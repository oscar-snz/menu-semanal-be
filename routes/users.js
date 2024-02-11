const User = require('../models/user');
const express = require('express');
const jwt = require('jsonwebtoken'); // Importa jsonwebtoken
const router = express.Router();
const { validateRegistrationBody } = require('../middleware/validateFields');

const JWT_SECRET = process.env.JWT_SECRET;
router.post('/register', validateRegistrationBody, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Verifica si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
    }

    // Crea y guarda el nuevo usuario
    const newUser = new User({ name, email, password });
    await newUser.save();

    // Genera un token para el nuevo usuario
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '1h' } // El token expira en 1 hora
    );

    // Envía los datos del usuario y el token como respuesta
    res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: { name: newUser.name, email: newUser.email },
      token: token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
  }
});
module.exports = router;
