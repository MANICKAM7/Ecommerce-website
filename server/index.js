const express = require('express');
const cors = require('cors');
const path = require('path');

// 🔥 FORCE load .env from root folder
require('dotenv').config({ path: __dirname + '/.env' });

// 🔥 DEBUG — confirm correct env value
console.log("👉 DB HOST FROM ENV:", process.env.DB_HOST);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/admin', require('./routes/admin'));

// DB
const db = require('./config/db');

// Categories (public)
app.get('/api/categories', async (req, res) => {
  try {
    const [cats] = await db.query('SELECT * FROM categories ORDER BY name');
    res.json({ success: true, categories: cats });
  } catch (error) {
    console.error("❌ DB Query Error:", error.message);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'AEcommerce API is running! 🚀', time: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`🚀 AEcommerce Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
