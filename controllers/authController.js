const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta." });
    }

    const payload = {
        user: {
          id: user.id, 
          email: user.email,
          name: user.name
        }
      };
  
    // Generar el token JWT
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET, // Una clave secreta para firmar el token. Guárdala en tus variables de entorno.
      { expiresIn: 3600 } // Expira en 1 hora. Ajusta esto según tus necesidades.
    );

    // Envía la respuesta con el token y los datos del usuario
    res.json({
      message: "Inicio de sesión exitoso.",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isSubscribed: user.isSubscribed, 
        hasUsedTrial: user.hasUsedTrial, 
        trialEndDate: user.trialEndDate, 
        subscriptionEndDate: user.subscriptionEndDate
      },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error del servidor." });
  }
};
