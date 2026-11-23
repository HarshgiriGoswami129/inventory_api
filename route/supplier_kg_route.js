const express = require('express');
const router = express.Router();
const supplierKGController = require('../controller/supplier_kg_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');

router.post('/', [authMiddleware], supplierKGController.createDeduction);
router.post('/getAll', [authMiddleware], supplierKGController.getAllDeductions);
router.get('/', [authMiddleware], supplierKGController.getAllDeductions);
router.get('/:id', [authMiddleware], supplierKGController.getDeductionById);
router.post('/delete', [authMiddleware], supplierKGController.deleteDeduction);
router.delete('/:id', [authMiddleware], supplierKGController.deleteDeduction);
router.post('/recalculate', [authMiddleware], supplierKGController.recalculateBalances);

module.exports = router;
