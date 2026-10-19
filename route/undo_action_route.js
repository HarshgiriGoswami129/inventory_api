const express = require('express');
const router = express.Router();
const undoActionController = require('../controller/undo_action_controller');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

// Get recent undoable actions
router.get('/recent', undoActionController.getRecentActions);
router.post('/recent', undoActionController.getRecentActions);

// Execute undo for a specific action ID
router.post('/undo', undoActionController.undoAction);

module.exports = router;
