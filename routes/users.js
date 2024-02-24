const User = require('../models/user');
const express = require('express');
const jwt = require('jsonwebtoken'); // Importa jsonwebtoken
const router = express.Router();
const { validateRegistrationBody } = require('../middleware/validateFields');
const authMiddleware = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET;

router.get('/family-members', authMiddleware, async (req, res) => {
  try {
    // Busca el usuario por ID obtenido del token JWT
    const user = await User.findById(req.user.id).select('familyMembers wantsToAddFamilyMembers');
    if (!user) {
      return res.status(404).send({ message: 'Usuario no encontrado.' });
    }
    // Devuelve los miembros de la familia del usuario y el estado de wantsToAddFamilyMembers
    res.json({ 
      wantsToAddFamilyMembers: user.wantsToAddFamilyMembers,
      familyMembers: user.familyMembers 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los miembros de la familia');
  }
});

router.get('/user-data', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id, 'health diet');

    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }

    // Devuelve solo los campos health y diet del documento del usuario
    res.json({ health: user.health, diet: user.diet });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los datos del usuario');
  }
});

router.patch('/update-family-preference', authMiddleware, async (req, res) => {
  const { wantsToAddFamilyMembers } = req.body;
  try {
  const updatedUser = await User.findByIdAndUpdate(req.user.id, { $set: { wantsToAddFamilyMembers } }, { new: true });
  res.json(updatedUser);
  } catch (error) {
  console.error(error);
  res.status(500).send('Error al actualizar la preferencia del usuario');
  }
  });

  router.post('/update-diet-type', authMiddleware, async (req, res) => {
    const { diet } = req.body;
    try {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, { $set: { diet } }, { new: true });
    res.json(updatedUser);
    } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar la preferencia del usuario');
    }
    });

    router.patch('/update-health-type', authMiddleware, async (req, res) => {
      const { health } = req.body;
      try {
      const updatedUser = await User.findByIdAndUpdate(req.user.id, { $set: { health } }, { new: true });
      res.json(updatedUser);
      } catch (error) {
      console.error(error);
      res.status(500).send('Error al actualizar la preferencia del usuario');
      }
      });  
  
    

  router.post('/add-family-member', authMiddleware, async (req, res) => {
    const { name, age } = req.body;
    try {
    const user = await User.findById(req.user.id);
    user.familyMembers.push({ name, age });
    await user.save();
    res.status(201).json(user);
    } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar un miembro de la familia');
    }
    });  

    router.delete('/deleteFamilyMember/:memberId', authMiddleware, async (req, res) => {
      const { memberId } = req.params;
      try {
      const user = await User.findOneAndUpdate({ _id: req.user.id}, {"$pull": {"familyMembers": {"_id": memberId}}},
      {new: true}
      );
   
      if (!user){
        return res.status(404).send("Persona no encontrada");
      }
      
      res.json({ message: 'Miembro de la familia eliminado' });
      } catch (error) {
      console.error(error);
      res.status(500).send('Error al eliminar el miembro de la familia');
      }
      });

router.post('/register', validateRegistrationBody, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Verifica si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
    }

    // Crea y guarda el nuevo usuario
    const newUser = new User({ name, email, password });
    await newUser.save();

    // Genera un token para el nuevo usuario
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '1h' } // El token expira en 1 hora
    );

    // Envía los datos del usuario y el token como respuesta
    res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: { name: newUser.name, email: newUser.email },
      token: token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
  }
});
module.exports = router;
