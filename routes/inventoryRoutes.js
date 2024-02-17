// routes/inventarioRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Inventario = require('../models/inventory');

router.use(authMiddleware);

// Obtener todos los elementos del inventario
router.get('/', async (req, res) => {
  try {
    const inventario = await Inventario.find( { usuario: req.user.id } ).populate('articulos.tipoAlimento').populate('articulos.unidad');
    res.json(inventario);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

// Agregar un elemento al inventario
router.post('/agregar', async (req, res) => {
  const usuarioId = req.user.id;
  const { nombreAlimento, cantidad, tipoAlimento, unidad } = req.body;

  try {
    // Intenta encontrar el inventario existente del usuario
    let inventario = await Inventario.findOne({ usuario: usuarioId });
    let articulo = { nombreAlimento, cantidad, tipoAlimento, unidad };
    if (!inventario) {
      // Si no existe, crea un nuevo documento de inventario para el usuario
      inventario = new Inventario({
        usuario: req.user.id,
        articulos: [articulo]
      });
    } else {
      // Si existe, agrega o actualiza el artículo en el array de `articulos`
      // Esto puede requerir lógica adicional para determinar si un artículo debe agregarse o actualizarse
      inventario.articulos.push(articulo);
    }

    await inventario.save();
    res.status(201).json(inventario);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

// Actualizar un elemento del inventario
// Actualizar un elemento específico del inventario de un usuario
router.put('/modify/:articuloId', authMiddleware, async (req, res) => {
  const { articuloId } = req.params;
  const { nombreAlimento, cantidad, tipoAlimento, unidad } = req.body;

  try {
    // Encuentra el inventario del usuario autenticado
    let inventario = await Inventario.findOneAndUpdate(
      { usuario: req.user.id, "articulos._id": articuloId },
      {
        "$set": {
          "articulos.$": { nombreAlimento, cantidad, tipoAlimento, unidad, _id: articuloId }
        }
      },
      { new: true }
    );

    if (!inventario) {
      return res.status(404).send('Artículo no encontrado en el inventario.');
    }

    res.json(inventario);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});



// Eliminar un elemento del inventario
// Eliminar un elemento específico del inventario de un usuario
router.delete('/articulo/:articuloId', authMiddleware, async (req, res) => {
  const { articuloId } = req.params;

  try {
    // Encuentra el inventario y elimina el artículo específico
    let inventario = await Inventario.findOneAndUpdate(
      { usuario: req.user.id },
      { "$pull": { "articulos": { "_id": articuloId } } },
      { new: true }
    );
    console.log("user: ", req.user.id);

    if (!inventario) {
      return res.status(404).send('Artículo no encontrado en el inventario.');
    }

    res.json({ message: 'Artículo eliminado del inventario' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});


module.exports = router;
