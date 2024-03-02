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

  router.get('/byName', async (req, res) => {
    const nameParam = req.query.name;
    try {
      // Busca la unidad por su nombre en inglés
      const unidad = await Unidades.findOne({ nombreIngles: new RegExp(`^${nameParam}$`, 'i') });
      if (!unidad) {
       
        return res.status(404).json({ message: 'Unidad no encontrada.' });
      }
      // Si la unidad existe, la retorna
      res.json(unidad);
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


router.post('/add', async (req, res) => {
  try {
      // Verifica si la unidad ya existe basándose en el nombre en inglés para evitar duplicados
      const unidadExistente = await Unidades.findOne({ nombreIngles: req.body.nombreIngles });

      if (unidadExistente) {
          return res.status(400).send('La unidad ya existe');
      }

      // Crea una nueva unidad con la información proporcionada en el cuerpo de la solicitud
      const nuevaUnidad = new Unidades({
          nombre: req.body.nombre,
          abreviatura: req.body.abreviatura,
          nombreIngles: req.body.nombreIngles,
          uri: req.body.uri // Opcional, dependiendo si decides almacenar la URI de la ontología de Edamam
      });

      // Guarda la nueva unidad en la base de datos
      await nuevaUnidad.save();

      // Retorna la unidad recién creada como respuesta
      res.status(201).json(nuevaUnidad);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error al crear la unidad');
  }
});

  module.exports = router;