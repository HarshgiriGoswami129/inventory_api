const express = require('express');
const router = express.Router();
const jobWorkController = require('../controller/job_work_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');

router.use(authMiddleware);

// Define permissions for job-work module
const permission = ['job_work', 'job-work'];

router.post('/', checkPermission(permission), jobWorkController.createJobWork);
router.post('/createJobWork', checkPermission(permission), jobWorkController.createJobWork);
router.post('/getAllJobWork', checkPermission(permission), jobWorkController.getAllJobWork);
router.post('/updateJobWork', checkPermission(permission), jobWorkController.updateJobWork);
router.post('/deleteJobWork', checkPermission(permission), jobWorkController.deleteJobWork);
router.post('/batchUpdateJobWork', checkPermission(permission), jobWorkController.batchUpdateJobWork);
router.post('/batchDeleteJobWork', checkPermission(permission), jobWorkController.batchDeleteJobWork);

module.exports = router;
