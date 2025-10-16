const express = require('express');
const router = express.Router();
const inventoryController = require('../controller/inventory_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');

router.use(authMiddleware);

const permission = 'inventory_items';

// All routes use POST and do not have ':id' in the URL
router.post('/', checkPermission(permission), inventoryController.createItem);
router.post('/getAllInventory', checkPermission(permission), inventoryController.getAllItems);
router.post('/updateInventory', checkPermission(permission), inventoryController.updateItem);
router.post('/deleteInventory', checkPermission(permission), inventoryController.deleteItem);

router.post('/batchUpdateInventory', checkPermission(permission), inventoryController.batchUpdateItems);

router.post('/batchDeleteInventory', checkPermission(permission), inventoryController.batchDeleteItems);

router.post('/searchInventoryByItemCode', checkPermission(permission), inventoryController.searchItemsByItemCode);
router.post('/getItemCodes', checkPermission(permission), inventoryController.getAllItemCodes);
router.post('/getItemByItemCode', checkPermission(permission), inventoryController.getItemByItemCode);


module.exports = router;