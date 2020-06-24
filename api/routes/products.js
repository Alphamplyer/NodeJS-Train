const express = require('express');
const router = express.Router();

// REQUESTS : /products

router.get('/', (request, response, next) => {
    response.status(200).json({
        message: 'Handling GET requests to /products'
    });
});

router.post('/', (request, response, next) => {
    response.status(200).json({
        message: 'Handling POST requests to /products'
    });
});

// REQUESTS : /products/{id}

router.get('/:productId', (request, response, next) => {
    if (request.params.productId === 'special') {
        response.status(200).json({
            message: 'You discovered the special ID'
        });
    } else {
        response.status(200).json({
            message: 'You passed an ID'
        });
    }
})

module.exports = router;