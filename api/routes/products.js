const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

/// UPLOAD IMAGES SETTINGS ///////////////////////////////////////////////////////////////////////////////////////

const storage = multer.diskStorage({
  destination: function(request, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (request, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

/// IMPORT PRODUCT MODEL  ////////////////////////////////////////////////////////////////////////////////////////

const Product = require('../models/product');

// REQUESTS : /products

router.get('/', (request, response, next) => {
    Product.find()
    .select("name price _id productImage")
    .exec()
    .then(docs => {
        const result = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:49152/products/' + doc._id
                    }
                }
            })
        }

        console.log(docs);
        if (docs.length >= 0) {
            response.status(200).json(result);
        } else {
            response.status(404).json({
                message: "No entries found"
            });
        }
    })
    .catch(err => {
        console.log(err);
        response.status(500).json({
            error: err
        });
    });
});

router.post('/', upload.single('productImage'), (request, response, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: request.body.name,
        price: request.body.price,
        productImage: req.file.path 
    });
    
    product.save()
    .then(result => {
        console.log(result);
        response.status(201).json({
            message: 'New product created successfully',
            createdProduct: {
                _id: result._id,
                name: result.name,
                price: result.price,
                request: {
                    type: 'GET',
                    url: 'http://localhost:49152/products/' + result._id
                }
            }
        })
    })
    .catch(err => {
         console.log(err);
         response.status(500).json({ error: err });
    });
});

// REQUESTS : /products/{id}

router.get('/:productId', (request, response, next) => {
    Product.findById(request.params.productId)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        console.log("[Database] product =", doc);

        if (doc) {
            response.status(200).json({
                _id: doc._id,
                name: doc.name,
                price: doc.price,
                request: {
                    type: 'GET',
                    url: 'http://localhost:49152/products/' + doc._id
                }
            });
        } else {
            response.status(404).json('No valid entry found for provided ID.');
        }        
    })
    .catch(err => {
        console.log(err);
        response.status(500).json({ error: "Invalid ID. Please enter a valid ID" });
    });
});

router.patch("/:productId", (request, response, next) => {
    Product.updateOne(
        { _id: request.params.productId },
        { 
            $set: {
                name: request.body.name,
                price: request.body.price
            } 
        }
    )
    .exec()
    .then(result => {
        //console.log(result);
        response.status(200).json({
            message: "Product updated successfully",
            request: {
                type: 'GET',
                url: 'http://localhost:49152/products/' + request.params.productId
            }
        });
    })
    .catch(err => {
        console.log(err);
        response.status(500).json({ error : err });
    });
});

router.delete('/:productId', (request, response, next) => {
    Product.remove({ _id: request.params.productId })
    .exec()
    .then(result => {
        response.status(200).json({
            message: 'Product deleted successfully',
            request: {
                type: 'POST',
                url: 'http://localhost:49152/products',
                body: {
                    name: 'String',
                    price: 'Number'
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        response.status(500).json({ error: err });
    });
})

module.exports = router;