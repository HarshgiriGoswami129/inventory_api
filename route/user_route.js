const express = require('express');
const router = express.Router();
const userController = require('../controller/user_controller');

// Define the registration route
// POST /api/users/register
router.post('/register', userController.register);

router.post('/login', userController.login);

module.exports = router;