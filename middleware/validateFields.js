const { body, validationResult } = require('express-validator');

exports.validateRegistrationBody = [
  // Valida que el campo email sea un email válido
  body('name')
  .not().isEmpty()
  .withMessage("Nombre del usuario es campo obligatorio")
  .isLength( { max: 50})
  .withMessage('El nombre no debe exceder 50 caracteres'),

  body('email')
    .isEmail()
    .withMessage('Por favor, ingresa un correo electrónico válido')
    .normalizeEmail(),

  // Valida que el campo password no esté vacío y tenga una longitud mínima
  body('password')
    .not().isEmpty()
    .withMessage('La contraseña no puede estar vacía')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),

  // Middleware para verificar los resultados de la validación
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];