const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Por favor, ingresa un correo electrónico válido'],
  },
  password: { type: String, required: true },
});

userSchema.pre('save', async function(next) {
  // Solo hashea la contraseña si ha sido modificada (o es nueva)
  if (!this.isModified('password')) return next();

  try {
    // Genera un 'salt' y utiliza ese 'salt' para hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Pasa el error al siguiente middleware en la cadena
  }
});

const User = mongoose.model('User', userSchema, 'Usuario');

module.exports = User;
