require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user'); // Ajusta la ruta al modelo User
const { dbConnect } = require('./database/config'); // Ajusta la ruta según tu estructura

// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(async () => console.log('Conectado a MongoDB'))
//     .catch(err => console.error('Error conectando a MongoDB:', err));


    // Actualiza todos los documentos añadiendo los campos nuevos con valores por defecto
    async function actualizarUsuarios(){
    const result = await User.updateMany({}, {
      $set: {
        hasUsedTrial: false, 
      }
    });
    return result;
  }

  dbConnect().then(() => {
    console.log('Conexión exitosa a MongoDB. Iniciando la actualizacion de datos...');
    actualizarUsuarios().then(() => {
      console.log("Datos cargados con exito.");
     }).catch(error => console.error("error al cargar datos: ", error));
}).catch(err => {
  console.error('Error conectando a MongoDB', err);
});
