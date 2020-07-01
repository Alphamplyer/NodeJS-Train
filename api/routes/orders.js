const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Order = require('../models/order');
const Product = require('../models/product');

const OrdersController = require('../controllers/ordersController');

/// GET REQUEST //////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/', checkAuth, OrdersController.orders_get_all);
router.get('/:orderId', checkAuth, OrdersController.orders_get_one);


/// POST REQUEST /////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/', checkAuth, OrdersController.orders_create);


/// PATCH REQUEST ////////////////////////////////////////////////////////////////////////////////////////////////

router.patch('/:orderId', checkAuth, OrdersController.orders_update);


/// DELETE REQUEST ///////////////////////////////////////////////////////////////////////////////////////////////

router.delete('/:orderId', checkAuth, OrdersController.orders_delete);



module.exports = router;