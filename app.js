require('dotenv').config();
const cors = require('cors');
const express = require('express');
const userRoutes = require('./routes/users');
const app = express();
const { dbConnect } = require('./database/config');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const foodTypes = require('./routes/foodTypes');
const units = require('./routes/units');
const weeklyMenu = require("./routes/weeklyMenu");
const weeklyShoppingList = require("./routes/shoppingList");


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

app.use('/api/inventario', inventoryRoutes);

app.use('/api/units', units);

app.use('/api/food', foodTypes);

app.get('/api/test', (req, res) => {
  res.status(200).send('El servidor está funcionando correctamente');
});

app.use('/api/weekly-menu', weeklyMenu);

app.use('/api/shoppingList/', weeklyShoppingList);



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);


});
