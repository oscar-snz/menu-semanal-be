// En controllers/userController.js
const User = require('../models/user');

const checkUserExists = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al verificar el usuario' });
  }
};

module.exports = {
  checkUserExists
};
