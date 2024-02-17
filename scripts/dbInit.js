require('dotenv').config();
const mongoose = require('mongoose');
const { dbConnect } = require('../database/config'); // Ajusta la ruta según tu estructura
const Unidad = require('../models/units'); // Ajusta la ruta según sea necesario
const TipoAlimento = require('../models/foodTypes'); // Ajusta la ruta según sea necesario

async function precargarDatos() {
  // Primero, precargamos las unidades
  const unidades = [
    { nombre: 'Unidades', abreviatura: 'ud' },
    { nombre: 'Gramo', abreviatura: 'gr' },
    { nombre: 'Litro', abreviatura: 'lt' },
    { nombre: 'Mililitro', abreviatura: 'ml' },
    { nombre: 'Libra', abreviatura: 'lb.'},
    { nombre: 'Cucharada', abreviatura: 'cda'},
    {nombre: 'Cucharadita', abreviatura: 'cdita'},
    {nombre: 'Onza', abreviatura: 'oz'},
    {nombre: 'Galon', abreviatura: 'gal'},
    {nombre: 'Taza', abreviatura: 'tz'},
    {nombre: 'Pizca', abreviatura: 'pca'}
    // Añade más unidades según necesites
  ];

  for (const unidad of unidades) {
    const unidadExistente = await Unidad.findOne({ nombre: unidad.nombre });
    if (!unidadExistente) {
      await Unidad.create(unidad);
    }
  }

  console.log('Unidades precargadas.');

  // Luego, precargamos los tipos de alimentos, referenciando las unidades
  const unidadGramo = await Unidad.findOne({ nombre: 'Gramo' });
  const unidadLitro = await Unidad.findOne({ nombre: 'Litro' });
  const unidadMililitro = await Unidad.findOne({ nombre: 'Mililitro' });
  const unidadLibra = await Unidad.findOne({ nombre: 'Libra' });
  const unidadCucharada = await Unidad.findOne({ nombre: 'Cucharada' });
  const unidadCucharadita = await Unidad.findOne({ nombre: 'Cucharadita' });
  const unidadOnza = await Unidad.findOne({ nombre: 'Onza' });
  const unidadGalon = await Unidad.findOne({ nombre: 'Galon' });
  const unidadTaza = await Unidad.findOne({ nombre: 'Taza' });
  const unidadPizca = await Unidad.findOne({ nombre: 'Pizca' });
  const unidadUnidades = await Unidad.findOne({ nombre: "Unidades"});

  const tiposAlimentos = [
    { 
      nombre: 'Lácteos', 
      unidadesPredeterminadas: [unidadLitro._id, unidadTaza._id, unidadLibra._id, unidadMililitro._id, unidadGalon._id, unidadCucharada._id ] // Ejemplo de lácteos medidos en litros y tazas
    },
    { nombre: 'Verduras',
    unidadesPredeterminadas: [unidadGramo._id, unidadLibra._id, unidadOnza._id]
    },
    { nombre: 'Carnes', 
    unidadesPredeterminadas: [unidadGramo._id, unidadLibra._id, unidadOnza._id]
    },
    { nombre: 'Huevos', 
      unidadesPredeterminadas: [unidadUnidades._id]
    },
    { nombre: 'Legumbres', 
    unidadesPredeterminadas: [unidadUnidades._id, unidadGramo._id, unidadTaza._id, unidadOnza._id]
    },
    { nombre: 'Frutas', 
    unidadesPredeterminadas: [unidadUnidades._id, unidadGramo._id, unidadTaza._id, unidadOnza._id]
    },
    {
      nombre: "Cereales",
      unidadesPredeterminadas: [unidadGramo._id, unidadTaza._id, unidadOnza._id]
    },
    {
      nombre: "Condimentos",
      unidadesPredeterminadas: [unidadGramo._id, unidadCucharada._id, unidadCucharadita._id, unidadPizca._id]
    },
    {
      nombre: "Bebidas",
      unidadesPredeterminadas: [unidadCucharada._id, unidadCucharadita._id, unidadTaza._id, unidadLitro._id, unidadUnidades._id]
    },
    {
      nombre: "Otros",
      unidadesPredeterminadas: [unidadCucharada._id, unidadCucharadita._id, unidadTaza._id, unidadLitro._id, unidadUnidades._id, unidadGalon._id, unidadGramo._id, unidadLibra._id, unidadMililitro._id, unidadPizca._id, unidadOnza._id]
    }
  ];

  for (const tipoAlimento of tiposAlimentos) {
    const tipoAlimentoExistente = await TipoAlimento.findOne({ nombre: tipoAlimento.nombre });
    if (!tipoAlimentoExistente) {
      await TipoAlimento.create(tipoAlimento);
    }
  }

  console.log('Tipos de alimentos precargados.');
}

// Conectar a MongoDB y ejecutar la precarga
dbConnect().then(() => {
  console.log('Conexión exitosa a MongoDB. Iniciando la precarga de datos...');
  // Luego procede a precargar datos. Asegúrate de manejar correctamente las promesas o async/await aquí
  precargarDatos().then(() => {
    console.log("Datos cargados con exito.");
  }).catch(err => console.error("error al cargar datos: ", err)); 
  }).catch(error => {
  console.error('Error al conectar con MongoDB:', error);
});