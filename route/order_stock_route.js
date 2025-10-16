const express = require('express');
const router = express.Router();
const orderStockController = require('../controller/order_stock_controller');
const authMiddleware = require('../middlewares/auth');

router.post('/',authMiddleware, orderStockController.addOrderStock);
router.post('/getOrderStock',authMiddleware, orderStockController.getOrderStock);
router.post('/updateOrderStock',authMiddleware, orderStockController.updateOrderStock);
router.post('/deleteOrderStock', authMiddleware,orderStockController.deleteOrderStock);

module.exports = router;
