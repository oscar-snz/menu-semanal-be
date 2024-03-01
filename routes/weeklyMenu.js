const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const authMiddleware = require('../middleware/auth'); // Asegúrate de tener este middleware implementado

// Ruta para establecer el menú semanal del usuario
router.post('/', authMiddleware, menuController.createWeeklyMenu);
router.get('/byStartDate', authMiddleware, menuController.getWeeklyMenuByStartDate);
router.get('/byDate', authMiddleware, menuController.getMenuByDate);

module.exports = router;
