const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const stockRoutes = require('./routes/stockRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('SafeStock Backend API');
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stock', stockRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});