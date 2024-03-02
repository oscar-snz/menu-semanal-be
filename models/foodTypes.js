const mongoose = require('mongoose');

const tipoAlimentoSchema = new mongoose.Schema({
  nombre: String,
  nombreIngles: String,
  unidadesPredeterminadas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unidades'
  }]
}, {collection: 'TipoDeAlimentos'});

const TipoDeAlimentos = mongoose.model('TipoDeAlimentos', tipoAlimentoSchema);

module.exports = TipoDeAlimentos;
