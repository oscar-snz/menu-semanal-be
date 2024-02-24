const jwt = require('jsonwebtoken');
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).send({ message: 'No hay token, autorización denegada' });
  }
  const token = req.header('Authorization').replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id); 
    if (!user) {
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ message: 'Token no válido' });
  }
};

module.exports = authMiddleware;
