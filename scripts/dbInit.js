require('dotenv').config();
const mongoose = require('mongoose');
const { dbConnect } = require('../database/config'); // Ajusta la ruta según tu estructura
const Unidad = require('../models/units'); // Ajusta la ruta según sea necesario
const TipoAlimento = require('../models/foodTypes'); // Ajusta la ruta según sea necesario

async function precargarDatos() {
  // Primero, precargamos las unidades
  const unidades = [
    { nombre: 'Onza', abreviatura: 'oz', nombreIngles: "<unit>" },
    { nombre: 'Gramo', abreviatura: 'gr', nombreIngles: "Gram" },
    { nombre: 'Libra', abreviatura: 'lb.', nombreIngles: "Pound" },
    { nombre: 'Kilogramo', abreviatura: 'kg', nombreIngles: "Kilogram" },
    { nombre: 'Pizca', abreviatura: 'pca', nombreIngles: "Pinch" },
    { nombre: 'Litro', abreviatura: 'lt', nombreIngles: "Liter" },
    { nombre: 'Onza liquida', abreviatura: 'oz liq', nombreIngles: "oz liq" },
    { nombre: 'Galon', abreviatura: 'gal', nombreIngles: "Gallon" },
    { nombre: 'Pinta', abreviatura: 'pinta', nombreIngles: "Pint" },
    { nombre: 'Cuarto estadounidense', abreviatura: 'Q', nombreIngles: "Quart" },
    { nombre: 'Gota', abreviatura: 'gota', nombreIngles: "Drop" },
    { nombre: 'Taza', abreviatura: 'tz', nombreIngles: "Cup" },
    { nombre: 'Cucharada', abreviatura: 'cda', nombreIngles: "Tablespoon" },
    { nombre: 'Cucharadita', abreviatura: 'cdita', nombreIngles: "Teaspoon" },
    { nombre: 'Unidad', abreviatura: 'ud', nombreIngles: "<unit>" },
    { nombre: 'Bulbo', abreviatura: 'bl', nombreIngles: "bulb" },
    { nombre: 'Diente', abreviatura: 'dnt', nombreIngles: "clove" },
    { nombre: "Al gusto", abreviatura: 'al gusto', nombreIngles: null },
    { nombre: "Rebanada", abreviatura: 'slice', nombreIngles: "slice" },

  ];

  for (const unidad of unidades) {
    const unidadExistente = await Unidad.findOne({ nombre: unidad.nombre });
    if (!unidadExistente) {
      await Unidad.create(unidad);
    }
  }

  console.log('Unidades precargadas.');

  // Luego, precargamos los tipos de alimentos, referenciando las unidades
  const unidadOnza = await Unidad.findOne({ nombre: 'Onza' });
  const unidadGramo = await Unidad.findOne({ nombre: 'Gramo' });
  const unidadLibra = await Unidad.findOne({ nombre: 'Libra' });
  const unidadKilo = await Unidad.findOne({ nombre: 'Kilogramo' });
  const unidadPizca = await Unidad.findOne({ nombre: 'Pizca' });
  const unidadLitro = await Unidad.findOne({ nombre: 'Litro' });
  const unidadOnzaLiq = await Unidad.findOne({ nombre: 'Onza liquida' });
  const unidadGalon = await Unidad.findOne({ nombre: 'Galon' });
  const unidadPinta = await Unidad.findOne({ nombre: 'Pinta' });
  const unidadCuarto = await Unidad.findOne({ nombre: 'Cuarto estadounidense' });
  const unidadGota = await Unidad.findOne({ nombre: 'Gota' });
  const unidadTaza = await Unidad.findOne({ nombre: 'Taza' });
  const unidadCucharada = await Unidad.findOne({ nombre: 'Cucharada' });
  const unidadCucharadita = await Unidad.findOne({ nombre: 'Cucharadita' });
  const unidadUnidad = await Unidad.findOne({ nombre: "Unidad" });
  const unidadBulbo = await Unidad.findOne({ nombre: "Bulbo" });
  const unidadDiente = await Unidad.findOne({ nombre: "Diente" });
  const unidadRebanada = await Unidad.findOne({ nombre: "Rebanada" });



  const tiposAlimentos = [
    {
      nombre: 'Lácteos',
      nombreIngles: "dairy",
      unidadesPredeterminadas: [unidadLitro._id, unidadTaza._id, unidadLibra._id, unidadOnzaLiq._id, unidadGalon._id, unidadCucharada._id] // Ejemplo de lácteos medidos en litros y tazas
    },
    {
      nombre: 'Verduras',
      nombreIngles: "vegetables",
      unidadesPredeterminadas: [unidadGramo._id, unidadLibra._id, unidadOnza._id, unidadDiente._id, unidadUnidad._id]
    },
    {
      nombre: 'Carnes',
      nombreIngles: "meat",
      unidadesPredeterminadas: [unidadGramo._id, unidadLibra._id, unidadOnza._id, unidadKilo._id]
    },
    {
      nombre: 'Huevos',
      nombreIngles: "Eggs",
      unidadesPredeterminadas: [unidadUnidad._id]
    },
    {
      nombre: 'Frutas',
      nombreIngles: "fruit",
      unidadesPredeterminadas: [unidadUnidad._id, unidadGramo._id, unidadTaza._id, unidadOnza._id, unidadOnza._id]
    },
    {
      nombre: "Cereales",
      nombreIngles: "ready-to-eat cereals",
      unidadesPredeterminadas: [unidadGramo._id, unidadTaza._id, unidadOnza._id, unidadCucharada._id, unidadCucharadita._id, unidadUnidad._id]
    },
    {
      nombre: "Granos",
      nombreIngles: "grains",
      unidadesPredeterminadas: [unidadGramo._id, unidadTaza._id, unidadOnza._id]
    },
    {
      nombre: "Aceites",
      nombreIngles: "oils",
      unidadesPredeterminadas: [unidadGramo._id, unidadCucharada._id, unidadCucharadita._id, unidadPizca._id, unidadGota._id]
    },
    {
      nombre: "Quesos",
      nombreIngles: "cheese",
      unidadesPredeterminadas: [unidadTaza._id, unidadLibra._id, unidadOnza._id, unidadGramo._id, unidadCucharada._id, unidadCucharadita._id]
    },
    {
      nombre: "Yogur",
      nombreIngles: "yogurt",
      unidadesPredeterminadas: [unidadTaza._id, unidadLibra._id, unidadOnza._id, unidadOnzaLiq._id, unidadGramo._id, unidadCucharada._id, unidadCucharadita._id]
    },
    {
      nombre: "Panes",
      nombreIngles: "bread, rolls and tortillas",
      unidadesPredeterminadas: [unidadUnidad._id, unidadRebanada._id]
    },
    {
      nombre: "Embutidos",
      nombreIngles: "cured meats",
      unidadesPredeterminadas: [unidadGramo._id, unidadLibra._id, unidadOnza._id, unidadKilo._id]
    },
    {
      nombre: "Salsas y Condimentos",
      nombreIngles: "Condiments and sauces",
      unidadesPredeterminadas: [unidadGramo._id, unidadCucharada._id, unidadCucharadita._id, unidadPizca._id, unidadGota._id, unidadBulbo._id]
    },
    {
      nombre: "Mariscos",
      nombreIngles: "seafood",
      unidadesPredeterminadas: [unidadGramo._id, unidadLibra._id, unidadOnza._id, unidadKilo._id]
    },
    {
      nombre: "Pollo",
      nombreIngles: "Poultry",
      unidadesPredeterminadas: [unidadGramo._id, unidadLibra._id, unidadOnza._id, unidadKilo._id]
    },
    {
      nombre: "Otros",
      nombreIngles: "others",
      unidadesPredeterminadas: [unidadOnza._id, unidadGramo._id, unidadLibra._id, unidadKilo._id, unidadPizca._id, unidadLitro._id, unidadOnzaLiq._id, unidadGalon._id, unidadPinta._id, unidadCuarto._id, unidadGota._id,
        unidadTaza._id, unidadCucharada._id, unidadCucharadita._id, unidadUnidad._id, unidadBulbo._id, unidadDiente._id, unidadRebanada._id]
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