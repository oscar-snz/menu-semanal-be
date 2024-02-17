const express = require('express');
const router = express.Router();
const Unidades = require('../models/units');
const TipoDeAlimentos = require('../models/foodTypes');

router.get('/', async (req, res) => {
    try {
      const unidades = await Unidades.find();
      res.json(unidades);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error en el servidor');
    }
  });

  router.get('/:id', async (req, res) => {
    try {
        const tipoAlimento = await TipoDeAlimentos.findById(req.params.id).populate('unidadesPredeterminadas');
        if (!tipoAlimento) {
            return res.status(404).send('Tipo de alimento no encontrado');
        }
        res.json(tipoAlimento.unidadesPredeterminadas);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});
  
  module.exports = router;