const express = require('express');
const router = express.Router();
const receiptController = require('../controller/receipt_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');
const upload = require('../middlewares/upload');

router.post('/', [authMiddleware, checkPermission('receipts'), upload], receiptController.createReceipt);
router.get('/', [authMiddleware, checkPermission('receipts')], receiptController.getAllReceipts);

module.exports = router;