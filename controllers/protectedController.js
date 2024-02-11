// controllers/protectedController.js

// Función para manejar una acción protegida
exports.protectedAction = (req, res) => {
    // La lógica aquí puede acceder al usuario autenticado a través de req.user,
    // si tu middleware de autenticación adjunta el usuario al objeto req.
    
    // Ejemplo de respuesta:
    res.json({
      msg: "Acceso concedido a la ruta protegida",
      user: req.user // Suponiendo que tu middleware adjunta el usuario aquí
    });
  };
  
  