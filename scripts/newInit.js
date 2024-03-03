require('dotenv').config();
const mongoose = require('mongoose');
const { dbConnect } = require('../database/config'); // Ajusta la ruta según tu estructura
const Unidad = require('../models/units'); // Ajusta esta ruta al lugar donde tienes tu modelo de Unidad
const TipoAlimento = require('../models/foodTypes'); // Ajusta la ruta según sea necesario

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

// const unidadesParaInsertar = [
//   { nombreIngles: "Ounce", nombre: "Onza", abreviatura: "oz" },
//   { nombreIngles: "Gram", nombre: "Gramo", abreviatura: "g"},
//   { nombreIngles: "Pound", nombre: "Libra", abreviatura: "lb"},
//   { nombreIngles: "Kilogram", nombre: "Kilogramo", abreviatura: "kg"},
//   { nombreIngles: "Pinch", nombre: "Pizca", abreviatura: "pizca" },
//   { nombreIngles: "Liter", nombre: "Litro", abreviatura: "L"},
//   { nombreIngles: "Fluid ounce", nombre: "Onza líquida", abreviatura: "oz líq"},
//   { nombreIngles: "Gallon", nombre: "Litro", abreviatura: "L"},
//   { nombreIngles: "Pint", nombre: "Pinta", abreviatura: "p" },
//   { nombreIngles: "Quart", nombre: "Cuarto estadounidense", abreviatura: "Q"  },
//   { nombreIngles: "Drop", nombre: "Litro", abreviatura: "L"  },
//   { nombreIngles: "Cup", nombre: "Litro", abreviatura: "L"},
//   { nombreIngles: "Tablespoon", nombre: "Litro", abreviatura: "L" },
//   { nombreIngles: "Teaspoon", nombre: "Litro", abreviatura: "L"},
//   { nombreIngles: "<unit>", nombre: "Unidad", abreviatura: "ud"},
//   { nombreIngles: "bulb", nombre: "Bulbo", abreviatura: "bl"},
//   { nombreIngles: "clove", nombre: "Diente", abreviatura: "diente"},
//   {nombreIngles: null, nombre: "al gusto", abreviature: "al gusto"}

//   // Añade el resto de unidades aquí siguiendo el mismo patrón
// ];
 async function precargarDatos() {

// const unidadOnza = await Unidad.findOne({ nombreIngles: 'Ounce' });
// const unidadGramo = await Unidad.findOne({ nombreIngles: 'Gram' });
//   const unidadLibra = await Unidad.findOne({ nombreIngles: 'Pound' });
//   const unidadKilo = await Unidad.findOne({ nombreIngles: 'Kilogram' });
//   const unidadPizca = await Unidad.findOne({ nombreIngles: 'Pinch' });
//   const unidadLitro = await Unidad.findOne({ nombreIngles: 'Liter' });
//   const unidadOnzaLiq = await Unidad.findOne({ nombreIngles: 'Fluid oun' });
//   const unidadGalon = await Unidad.findOne({ nombreIngles: 'Gallon' });
//   const unidadPinta = await Unidad.findOne({ nombreIngles: 'Pint' });
//   const unidadCuarto = await Unidad.findOne({ nombreIngles: 'Quart' });
//   const unidadGota = await Unidad.findOne({ nombreIngles: 'Drop' });
//   const unidadTaza = await Unidad.findOne({ nombreIngles: 'Cup' });
//   const unidadCucharada = await Unidad.findOne({ nombreIngles: 'Tablespoon' });





//   const unidadCucharadita = await Unidad.findOne({ nombre: 'Cucharadita' });
//   const unidadUnidades = await Unidad.findOne({ nombre: "Unidades"});
  

  const tiposAlimentos = [
    { 
      nombre: 'Lácteos', 
    },
    { nombre: 'Verduras',
    },
    { nombre: 'Carnes', 
    },
    { nombre: 'Embutidos', 
    },
    { nombre: 'Huevos', 
    },
    { nombre: 'Legumbres', 
    },
    { nombre: 'Frutas', 
    },
    {
      nombre: "Cereales",
    },
    {
      nombre: "Panes de reposteria",
    },
    {
      nombre: "Panes y tortilla",
    },
    {
      nombre: "Endulzantes",
    },
    {
      nombre: "Quesos",
    },
    {
      nombre: "Cafe y Te",
    },
    {
      nombre: "Chocolate",
    },
    {
      nombre: "Jarabes",
    },
    {
      nombre: "Aceites",
    },
    {
      nombre: "Granos",
    },
    {
      nombre: "Salsas y Condimentos",
    },
    {
      nombre: "Bebidas",
    },
    {
      nombre: "Otros",
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

