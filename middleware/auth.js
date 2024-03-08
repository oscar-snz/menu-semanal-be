const jwt = require('jsonwebtoken');
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).send({ message: 'No hay token, autorización denegada' });
  }
  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id); 
    if (!user) {
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }

    // Asumimos valores por defecto para evitar problemas con null
    const isSubscriptionActive = user.isSubscribed || false;
    // Si trialEndDate es null o una fecha pasada, isTrialActive será false
    const isTrialActive = user.trialEndDate ? new Date(user.trialEndDate) > new Date() : false;
    const isStartingSubscription = req.path === '/start-subscription';
    const userData = req.path === '/user-data';
   if ((!isSubscriptionActive && !isTrialActive) && !isStartingSubscription && !userData) {
      // Si el usuario no tiene una suscripción activa ni está en periodo de prueba, o ambos han expirado y no está intentando iniciar una suscripción
      return res.status(403).send({ isSubscribed: user.isSubscribed, hasUsedTrial: user.hasUsedTrial, trialEndDate: user.trialEndDate, subscriptionEndDate: user.subscriptionEndDate, message: 'No tienes una suscripción activa o tu periodo de prueba ha expirado.' });
    }

    // Si todo está en orden, añade el usuario al objeto de solicitud y continúa
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ message: 'Token no válido' });
  }
};

module.exports = authMiddleware;
