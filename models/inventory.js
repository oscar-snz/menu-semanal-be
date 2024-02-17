// models/Inventario.js
const mongoose = require('mongoose');

const inventarioSchema = new mongoose.Schema({
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

const Inventario = mongoose.model('Inventario', inventarioSchema);

module.exports = Inventario;
