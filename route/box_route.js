const express = require('express');
const router = express.Router();
const boxController = require('../controller/box_controller');

router.get('/getAll', boxController.getAllBoxes);
router.get('/names', boxController.getAllBoxNames);
router.post('/add', boxController.addBox);
router.put('/update/:id', boxController.updateBox);
router.post('/batch-update', boxController.batchUpdateBox);
router.delete('/delete/:id', boxController.deleteBox);

module.exports = router;
