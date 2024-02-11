const cors = require('cors');
const express = require('express');
const userRoutes = require('./routes/users');
const app = express();
const { dbConnect } = require('./database/config');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json()); // Para parsear cuerpos de solicitud en formato JSON
dbConnect();
// Montar las rutas
app.use('/api/users', userRoutes);

app.use('/api/auth', authRoutes);

app.use('/api', protectedRoutes);



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);


});
