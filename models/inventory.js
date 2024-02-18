// models/Inventario.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  nombreAlimento: {
    type: String,
    required: true
  },
  cantidad: {
    type: Number,
    required: true
  },
  tipoAlimento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TipoDeAlimentos', 
    required: true
  },
  unidad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unidades',
    required: true
  }
});

const inventarioSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true,
    unique: true // Asegura que sólo haya un inventario por usuario
  },
  articulos: [itemSchema] // Array de artículos en el inventario
});


const Inventario = mongoose.model('Inventario', inventarioSchema);

module.exports = Inventario;
