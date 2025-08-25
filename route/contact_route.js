const express = require('express');
const router = express.Router();
const contactController = require('../controller/contact_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');
const upload = require('../middlewares/upload'); // <-- Import the upload middleware

// Apply the upload middleware ONLY to the POST route.
// The middleware will handle the file upload first, then pass control to the controller.
router.post('/', [authMiddleware, checkPermission('contacts'), upload], contactController.createContact);

router.get('/', [authMiddleware, checkPermission('contacts')], contactController.getAllContacts);

module.exports = router;