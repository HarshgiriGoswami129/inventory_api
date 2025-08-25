const express = require('express');
const router = express.Router();
const paymentController = require('../controller/payment_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');
const upload = require('../middlewares/upload');

router.post('/', [authMiddleware, checkPermission('payments'), upload], paymentController.createPayment);
router.get('/', [authMiddleware, checkPermission('payments')], paymentController.getAllPayments);

module.exports = router;