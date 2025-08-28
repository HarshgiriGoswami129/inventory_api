const express = require('express');
const router = express.Router();
const masterController = require('../controller/master_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');

router.use(authMiddleware);

// Assuming you have a permission named 'master_items'
router.post('/', checkPermission('master_items'), masterController.createItem);
router.get('/', checkPermission('master_items'), masterController.getAllItems);
router.patch('/:id', checkPermission('master_items'), masterController.updateItem);
router.delete('/:id', checkPermission('master_items'), masterController.deleteItem);

module.exports = router;