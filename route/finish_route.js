const express = require('express');
const router = express.Router();
const finishesController = require('../controller/finish_controller');
const authMiddleware = require('../middlewares/auth');

router.post('/',authMiddleware, finishesController.addFinish);
router.post('/getFinish',authMiddleware, finishesController.getFinishes);
router.post('/updateFinish',authMiddleware, finishesController.updateFinish);
router.post('/deleteFinish',authMiddleware, finishesController.deleteFinish);

module.exports = router;
