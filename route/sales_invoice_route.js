const express = require('express');
const router = express.Router();
const salesInvoiceController = require('../controller/sales_invoice_controller');
const authMiddleware = require('../middlewares/auth');
const checkPermission = require('../middlewares/checkPermission');

router.post('/', [authMiddleware, checkPermission('sales_invoices')], salesInvoiceController.createInvoice);
router.post('/getAllSalesInvoice', [authMiddleware, checkPermission('sales_invoices')], salesInvoiceController.getAllInvoices);
router.post('/updateSalesInvoice', [authMiddleware, checkPermission('sales_invoices')], salesInvoiceController.updateInvoice);
router.post('/deleteSalesInvoice', [authMiddleware, checkPermission('sales_invoices')], salesInvoiceController.deleteInvoice);
router.post('/getDistinctCustomerNames', [authMiddleware, checkPermission('sales_invoices')], salesInvoiceController.getDistinctCustomerNames);
router.post('/findFinishNoteByCustomerName', [authMiddleware, checkPermission('sales_invoices')], salesInvoiceController.findFinishNoteByCustomerName);
router.post('/getUnfinishedFinishes', [authMiddleware, checkPermission('sales_invoices')], salesInvoiceController.getUnfinishedFinishesForCustomer);
router.post('/findInvoiceByNumber', [authMiddleware, checkPermission('sales_invoices')], salesInvoiceController.findInvoiceByNumber);
router.post('/getInvoiceSummary', [authMiddleware, checkPermission('sales_invoices')], salesInvoiceController.getInvoiceSummary);
router.post('/batchCreate', [authMiddleware, checkPermission('sales_invoices')], salesInvoiceController.createBatchInvoices);

// router.post('/previewSalesOrderImpact', [authMiddleware, checkPermission('sales_invoices')], salesInvoiceController.previewSalesOrderImpact);
module.exports = router;
