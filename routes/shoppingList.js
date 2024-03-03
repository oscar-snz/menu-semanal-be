const express = require('express');
const router = express.Router();
const { createShoppingListForWeek, getShoppingListByStartDate } = require('../controllers/shoppingListController');
const authMiddleware = require('../middleware/auth');

// Ruta para crear la lista de compras semanal
router.post('/create', authMiddleware, createShoppingListForWeek);
router.get("/byStartDate", authMiddleware, getShoppingListByStartDate)

module.exports = router;
