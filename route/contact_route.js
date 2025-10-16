const express = require('express');
const router = express.Router();
const contactController = require('../controller/contact_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');
const upload = require('../middlewares/upload'); // <-- Import the upload middleware

// Apply the upload middleware ONLY to the POST route.
// The middleware will handle the file upload first, then pass control to the controller.
// Corrected Line
router.post('/', [authMiddleware, checkPermission('contacts'), upload.single('image')], contactController.createContact);

router.post('/getAllContact', [authMiddleware, checkPermission('contacts')], contactController.getAllContacts);

// Add these routes for update and delete
router.post('/updateContact', [authMiddleware, checkPermission('contacts'), upload.single('image')], contactController.updateContact);

router.post('/deleteContact', [authMiddleware, checkPermission('contacts')], contactController.deleteContact);

// Add this line after your existing routes
router.post('/getAllContactCodes', [authMiddleware, checkPermission('contacts')], contactController.getAllContactCodes);


module.exports = router;