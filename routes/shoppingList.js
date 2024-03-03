const express = require('express');
const router = express.Router();
const { createShoppingListForWeek } = require('../controllers/shoppingListController');
const authMiddleware = require('../middleware/auth');

// Ruta para crear la lista de compras semanal
router.post('/create', authMiddleware, createShoppingListForWeek);

module.exports = router;
