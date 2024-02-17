// routes/inventarioRoutes.js
const express = require('express');
const router = express.Router();
const Inventario = require('../models/inventory');

// Obtener todos los elementos del inventario
router.get('/', async (req, res) => {
  try {
    const inventario = await Inventario.find().populate('tipoAlimento').populate('unidad');
    res.json(inventario);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

// Agregar un elemento al inventario
router.post('/', async (req, res) => {
  try {
    const { nombreAlimento, cantidad, tipoAlimento, unidad } = req.body;
    let elemento = new Inventario({ nombreAlimento, cantidad, tipoAlimento, unidad });
    await elemento.save();
    res.status(201).json(elemento);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

// Actualizar un elemento del inventario
router.put('/:id', async (req, res) => {
  try {
    const { nombreAlimento, cantidad, tipoAlimento, unidad } = req.body;
    let elemento = await Inventario.findByIdAndUpdate(req.params.id, { nombreAlimento, cantidad, tipoAlimento, unidad }, { new: true });
    res.json(elemento);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

// Eliminar un elemento del inventario
router.delete('/:id', async (req, res) => {
  try {
    await Inventario.findByIdAndDelete(req.params.id);
    res.json({ message: 'Elemento eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
