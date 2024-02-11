const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Obtiene el token del header de la solicitud
    const token = req.header('Authorization').replace('Bearer ', '');
    // Verifica el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Adjunta el usuario decodificado al objeto de solicitud
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Por favor, autentíquese.' });
  }
};

module.exports = auth;
