const express = require('express');
const router = express.Router();
const paymentController = require('../controller/payment_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');
const upload = require('../middlewares/upload');

router.post('/', [authMiddleware, checkPermission('payments'), upload.single('image')], paymentController.createPayment);
router.post('/getAllPayment', [authMiddleware, checkPermission('payments')], paymentController.getAllPayments);
router.post('/updatePayment', [authMiddleware, checkPermission('payments'), upload.single('image')], paymentController.updatePayment);
router.post('/deletePayment', [authMiddleware, checkPermission('payments')], paymentController.deletePayment);


module.exports = router;