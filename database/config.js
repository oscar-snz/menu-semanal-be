const mongoose = require('mongoose');
require('dotenv').config();

const dbConnect = async () => {
mongoose.connect('mongodb+srv://oscargsancheze202:' + process.env.database_password + '@cluster0.ykqf6ck.mongodb.net/MenuFamiliar', {
}).then(() => {
  console.log('Conexión exitosa a MongoDB Atlas');
}).catch((error) => {
  console.error('Error al conectar con MongoDB:', error);
});
};

const User = require('../models/user');


module.exports = {
  dbConnect,
  User
}