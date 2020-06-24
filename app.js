const express = require('express');
const app = express();
const morgan = require('morgan');

// Routes
const productRoutes = require('./api/routes/products');

// Logs
app.use(morgan('dev'));

// Routes which should handle request
app.use('/products', productRoutes);

// Error Handler
app.use((request, response, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, request, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;