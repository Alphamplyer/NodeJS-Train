const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

// Routes
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users')

// DATABASE
mongoose.connect(
    'mongodb+srv://dev-account:' +
    process.env.MONGODB_PASSWORD +
    '@devapp-rk8vh.mongodb.net/DevApp?retryWrites=true&w=majority',
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }
)
.then(console.log('connection to database established'))
.catch(err => console.log(err));


// MIDDLEWARE
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// HEADER - Prevent CORS Error
app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (request.method === 'OPTIONS') {
        response.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
        return response.status(200).json({});
    }
    next();
});

// Routes which should handle request
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

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