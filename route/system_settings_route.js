const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const controller = require('../controller/system_settings_controller');

// Optional auth: decodes token if present without rejecting if absent
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return next();
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (!err && user) {
      req.user = user;
    }
    next();
  });
};

router.get('/field-controls', controller.getFieldControls);
router.post('/field-controls', controller.saveFieldControls);

router.get('/columns/:pageKey', optionalAuth, controller.getColumnSettings);
router.post('/columns/:pageKey', optionalAuth, controller.saveColumnSettings);

module.exports = router;
