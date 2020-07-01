const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const ProductsController = require('../controllers/productsController');

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


/// GET REQUEST //////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/', ProductsController.products_get_all);
router.get('/:productId', ProductsController.products_get_one);


/// POST REQUEST /////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create);


/// PATCH REQUEST ////////////////////////////////////////////////////////////////////////////////////////////////

router.patch("/:productId", checkAuth, ProductsController.products_update);


/// DELETE REQUEST ///////////////////////////////////////////////////////////////////////////////////////////////

router.delete('/:productId', checkAuth, ProductsController.products_delete);


module.exports = router;