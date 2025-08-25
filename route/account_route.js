const express = require('express');
const router = express.Router();
const accountController = require('../controller/account_controller');
const authMiddleware = require('../middlewares/auth');
router.use(authMiddleware); // Protect all account routes
router.post('/', accountController.createAccount);
router.get('/', accountController.getAllAccounts);
module.exports = router;