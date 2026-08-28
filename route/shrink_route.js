const express = require('express');
const router = express.Router();
const shrinkController = require('../controller/shrink_controller');

router.get('/getAll', shrinkController.getAllShrink);
router.get('/names', shrinkController.getAllShrinkNames);
router.post('/add', shrinkController.addShrink);
router.put('/update/:id', shrinkController.updateShrink);
router.post('/batch-update', shrinkController.batchUpdateShrink);
router.delete('/delete/:id', shrinkController.deleteShrink);

module.exports = router;
