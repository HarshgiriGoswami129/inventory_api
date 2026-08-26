const express = require('express');
const router = express.Router();
const controller = require('../controller/system_settings_controller');

router.get('/field-controls', controller.getFieldControls);
router.post('/field-controls', controller.saveFieldControls);

module.exports = router;
