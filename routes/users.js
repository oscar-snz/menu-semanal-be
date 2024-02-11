const User = require('../models/user');
const express = require('express');
const router = express.Router();
const { validateRegistrationBody} = require('../middleware/validateFields');


// Ruta para registrar un nuevo usuario
router.post('/register', validateRegistrationBody, async (req, res) => {
  try {
    // Asumiendo que newUser.save() es una operación que puede fallar
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      // Error de clave duplicada
      return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
  }
});

module.exports = router;
