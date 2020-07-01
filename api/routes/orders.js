const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (request, response, next) => {
    Order.find()
    .select("product quantity _id")
    .populate('product', 'name')
    .exec()
    .then(docs => {
        const result = {
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    productId: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:49152/orders/' + doc._id
                    }
                }
            })
        };

        if (docs.length >= 0) {
            response.status(200).json(result);
        } else {
            response.status(404).json({
                message: "No entries found"
            });
        }
    })
    .catch(err => {
        response.status(500).json({ error: err });
    });
});

router.post('/', checkAuth, (request, response, next) => {
    Product.findById(request.body.productId)
    .exec()
    .then(product => {
        if (!product) {
            return response.status(404).json({
                message: "Product not found."
            });
        }

        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            product: request.body.productId,
            quantity: request.body.quantity
        });
    
        return order.save()
    })
    .then(result => {
        if(response.statusCode === 404){
            return response;
        }

        response.status(201).json({
            message: 'New order created successfully',
            createdOrder: {
                _id: result._id,
                productId: result.product,
                quantity: result.quantity,
                request: {
                    type: 'GET',
                    url: 'http://localhost:49152/orders/' + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        response.status(500).json({ error: err });
    });
});

router.get('/:orderId', (request, response, next) => {
    Order.findById(request.params.orderId)
    .select("product quantity _id")
    .populate('product', 'name')
    .exec()
    .then(result => {
        console.log(result);
        response.status(201).json({
            _id: result._id,
            productId: result.product,
            quantity: result.quantity
        });
    })
    .catch (err => {
        console.log(err);
        response.status(500).json({ error: err });
    });
});

router.patch('/:orderId', checkAuth, (request, response, next) => {
    Product.findById(request.body.productId).exec()
    .then(product => {
        if (!product) {
            return response.status(404).json({
                message: "Product not found."
            })
        }

        return Order.updateOne(
            { _id: request.params.orderId },
            { 
                $set: {
                    productId: request.body.productId,
                    quantity: request.body.quantity
                } 
            }
        )
    })
    .then(result => {
        if (response.statusCode === 404) {
            return response;
        }

        response.status(200).json({
            message: "Order updated successfully",
            request: {
                type: 'GET',
                url: 'http://localhost:49152/orders/' + request.body.productId
            }
        });
    })
    .catch(err => {
        console.log(err);
        response.status(500).json({ error : err });
    });
});

router.delete('/:orderId', checkAuth, (request, response, next) => {
    Order.remove({ _id : request.params.orderId }).exec()
    .then(result => {
        response.status(200).json({
            message: 'Order deleted successfully',
            request: {
                type: 'POST',
                url: 'http://localhost:49152/orders',
                body: {
                    product: 'ObjectID',
                    quantity: 'Number'
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        response.status(500).json({ error: err });
    })
});

module.exports = router;