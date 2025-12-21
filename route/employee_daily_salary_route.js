const express = require('express');
const router = express.Router();

const employeeDailySalaryController = require('../controller/employee_daily_salary_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');

router.use(authMiddleware);

const permission = 'employee_daily_salary_records';

// All POST style, like your inventory routes
router.post('/', checkPermission(permission), employeeDailySalaryController.createRecord);
router.post('/getAll', checkPermission(permission), employeeDailySalaryController.getAllRecords);
router.post('/update', checkPermission(permission), employeeDailySalaryController.updateRecord);
router.post('/delete', checkPermission(permission), employeeDailySalaryController.deleteRecord);
router.post(
  '/getByEmployeeAndDateRange',
  checkPermission(permission),
  employeeDailySalaryController.getByEmployeeAndDateRange
);
router.post(
  '/getCurrentWeek',
  checkPermission(permission),
  employeeDailySalaryController.getCurrentWeekSummary
);
router.post(
  '/getByEmployeeAndDateRangePaginated',
  checkPermission(permission),
  employeeDailySalaryController.getByEmployeeAndDateRangePaginated
);

router.post(
  '/getCurrentWeekPaginated',
  checkPermission(permission),
  employeeDailySalaryController.getCurrentWeekSummaryPaginated
);

router.post(
  '/getAllPaginated',
  checkPermission(permission),
  employeeDailySalaryController.getAllRecordsPaginated
);


module.exports = router;
