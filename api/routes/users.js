const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const UsersController = require('../controllers/usersController');

/// POST REQUEST /////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/signup', UsersController.users_signup);
router.post('/login', UsersController.users_login);

/// DELETE REQUEST ///////////////////////////////////////////////////////////////////////////////////////////////

router.delete('/:userId', checkAuth, UsersController.users_delete);


module.exports = router;
