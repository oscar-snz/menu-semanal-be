// routes/protectedRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Aquí puedes importar los controladores que manejen las solicitudes a tus rutas protegidas
const { protectedAction } = require('../controllers/protectedController');

router.get('/profile', auth, protectedAction);

module.exports = router;
