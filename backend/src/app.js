require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount all API routes under /api
app.use('/api', apiRoutes);

// 404 Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found.`,
  });
});

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;
