const express = require('express');
const router = express.Router();
const patiController = require('../controller/pati_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');

router.use(authMiddleware);

const permission = 'master_items';

// All routes use POST method, following the same pattern as master routes
router.post('/', checkPermission(permission), patiController.createPati);
router.post('/getAllPati', checkPermission(permission), patiController.getAllPati);
router.post('/updatePati', checkPermission(permission), patiController.updatePati);
router.post('/deletePati', checkPermission(permission), patiController.deletePati);
router.post('/getPatiTypes', checkPermission(permission), patiController.getPatiTypes);

module.exports = router;
