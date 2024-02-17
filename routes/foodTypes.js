const express = require('express');
const router = express.Router();
const TipoDeAlimentos = require('../models/foodTypes'); // Asegúrate de que la ruta sea correcta

router.get('/types', async (req, res) => {
    try {
      const tiposAlimentos = await TipoDeAlimentos.find().populate('unidadesPredeterminadas');
      res.json(tiposAlimentos);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error en el servidor');
    }
  });

  module.exports = router;
  