const express = require('express');
const router = express.Router();
const inventoryController = require('../controller/inventory_controller');
// --- FIX: Corrected path from '../middlewares' to '../middleware' ---
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');

// Protect all routes in this file
router.use(authMiddleware);

// Define the CRUD routes
// Assuming you have a permission named 'inventory_items'
router.post('/', checkPermission('inventory_items'), inventoryController.createItem);
router.get('/', checkPermission('inventory_items'), inventoryController.getAllItems);
router.patch('/:id', checkPermission('inventory_items'), inventoryController.updateItem);
router.delete('/:id', checkPermission('inventory_items'), inventoryController.deleteItem);

module.exports = router;