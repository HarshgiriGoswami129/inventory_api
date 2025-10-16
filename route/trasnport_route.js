const express = require('express');
const router = express.Router();
const transportController = require('../controller/transport_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');

// Apply authentication to all routes in this file
router.use(authMiddleware);

// Define the permission required for this module
const permission = 'transport'; // Or any name you prefer

// All routes use the POST method
router.post('/addTransport',authMiddleware, transportController.addTransport);
router.post('/getTransports', authMiddleware, transportController.getTransports);
router.post('/updateTransport', authMiddleware, transportController.updateTransport);
router.post('/deleteTransport', authMiddleware, transportController.deleteTransport);

module.exports = router;
