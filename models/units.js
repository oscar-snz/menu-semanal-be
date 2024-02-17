// models/Unidad.js
const mongoose = require('mongoose');

const unidadSchema = new mongoose.Schema({
  nombre: String,
  abreviatura: String
}, {collection: 'Unidades'});

const Unidades = mongoose.model('Unidades', unidadSchema);

module.exports = Unidades;
