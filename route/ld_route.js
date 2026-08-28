const express = require('express');
const router = express.Router();
const ldController = require('../controller/ld_controller');

router.get('/getAll', ldController.getAllLd);
router.get('/names', ldController.getAllLdNames);
router.post('/add', ldController.addLd);
router.put('/update/:id', ldController.updateLd);
router.post('/batch-update', ldController.batchUpdateLd);
router.delete('/delete/:id', ldController.deleteLd);

module.exports = router;
