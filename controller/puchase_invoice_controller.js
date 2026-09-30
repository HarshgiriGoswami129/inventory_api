const PurchaseInvoice = require('../model/purchase_invoice_model');
const { logUserActivity } = require('../utils/activityLogger');
const { compareChanges } = require('../utils/compareChanges');
const SalesLock = require('../model/sales_lock_model');

// Helper function to process invoice items with new calculation logic
const processInvoiceItems = (items = []) => {
  if (!items || !Array.isArray(items)) {
    return [];
  }

  const toNum = (val) => {
    if (val === null || val === undefined || val === '') return 0;
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
  };

  return items.map(item => {
    // Ensure input values are treated as numbers
    const no_of_peti = toNum(item.no_of_peti);
    const ret_peti_no = toNum(item.ret_peti_no);

    // 1. Calculate the balance
    const peti_balance = no_of_peti - ret_peti_no;

    // 2. Determine the status: 0 = Pending, 1 = Partial, 2 = Done
    let pati_status;
    if (ret_peti_no === 0) {
      pati_status = 0; // Pending - no peti returned
    } else if (ret_peti_no >= no_of_peti) {
      pati_status = 2; // Done - all peti returned
    } else {
      pati_status = 1; // Partial - some peti returned
    }

    // 3. Return sanitized item object
    return {
      ...item,
      stock_kg: toNum(item.stock_kg),
      scrap: toNum(item.scrap),
      labour: toNum(item.labour),
      kg_dzn: toNum(item.kg_dzn),
      actual_dzn_wt: toNum(item.actual_dzn_wt),
      total_per_6a: toNum(item.total_per_6a),
      rate_pcr: toNum(item.rate_pcr),
      total_kg: toNum(item.total_kg),
      no_of_peti: no_of_peti,
      peti_wt: toNum(item.peti_wt),
      peti_balance: peti_balance,
      ret_peti_no: ret_peti_no,
      net_kg: toNum(item.net_kg),
      amount: toNum(item.amount),
      total_psc: toNum(item.total_psc),
      pati_status: pati_status,
      notes: item.notes || null,
      peti_Type: item.peti_Type || null,
      code: item.code || null
    };
  });
};


const purchaseInvoiceController = {
  addInvoiceWithItems: async (req, res) => {
    try {
      // Check if purchase invoices module is locked
      const isLocked = await SalesLock.isLocked('purchase_invoices');
      if (isLocked) {
        return res.status(403).json({
          success: false,
          message: 'Purchase Invoices are currently locked. Cannot create purchase invoices.'
        });
      }

      const { line_items, user_code, total_amount, ...invoiceData } = req.body;

      // Ensure dates are not empty strings to avoid MySQL strict mode errors
      if (!invoiceData.issue_date || (typeof invoiceData.issue_date === 'string' && invoiceData.issue_date.trim() === '')) {
        invoiceData.issue_date = new Date().toISOString().split('T')[0];
      }
      if (!invoiceData.due_date || (typeof invoiceData.due_date === 'string' && invoiceData.due_date.trim() === '')) {
        invoiceData.due_date = invoiceData.issue_date;
      }

      const processedItems = processInvoiceItems(line_items);

      const newInvoice = await PurchaseInvoice.createWithStockUpdate(
        invoiceData,
        processedItems,
        user_code,
        total_amount
      );
      await logUserActivity(req, {
        model_name: 'purchase_invoices',
        action_type: 'CREATE',
        record_id: newInvoice.id,
        description: `Created purchase invoice ${invoiceData.invoice_number || ''}`
      });
      res.status(201).json({ success: true, message: "Invoice created successfully.", data: newInvoice });
    } catch (error) {
      console.error('Error creating invoice:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  getAllInvoicesWithItems: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '' } = req.body;

      const result = await PurchaseInvoice.findAllPaginated({
        page: parseInt(page),
        limit: parseInt(limit),
        search: search || ''
      });

      const invoicesWithDetails = await Promise.all(result.data.map(async (invoice) => {
        const items = await PurchaseInvoice.findItemsByInvoiceId(invoice.id);
        return { ...invoice, items };
      }));

      res.status(200).json({
        success: true,
        data: invoicesWithDetails,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error getting all invoices:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  updateInvoice: async (req, res) => {
    try {
      // Destructure the new deleted_item_ids array from the request body
      const { id, line_items, deleted_item_ids, ...invoiceData } = req.body;

      if (!id) {
        return res.status(400).json({ success: false, message: 'Invoice ID is required for update.' });
      }

      if (invoiceData.due_date !== undefined && (!invoiceData.due_date || (typeof invoiceData.due_date === 'string' && invoiceData.due_date.trim() === ''))) {
        invoiceData.due_date = invoiceData.issue_date || new Date().toISOString().split('T')[0];
      }

      // Fetch old record before updating
      const oldRecord = await PurchaseInvoice.findById(id);
      if (!oldRecord) {
        return res.status(404).json({ success: false, message: 'Purchase invoice not found' });
      }

      // Process items to add calculated fields before sending to the model
      const processedItems = processInvoiceItems(line_items);

      const updatedInvoice = await PurchaseInvoice.updateWithItems(
        id,
        invoiceData,
        processedItems,
        deleted_item_ids // Pass the new array to the model
      );

      // Compare old vs new values and log changes (excluding line_items)
      const changes = compareChanges(oldRecord, invoiceData);
      await logUserActivity(req, {
        model_name: 'purchase_invoices',
        action_type: 'UPDATE',
        record_id: id,
        description: 'Updated purchase invoice',
        changes: changes
      });

      res.status(200).json({ success: true, message: 'Invoice updated successfully', data: updatedInvoice });
    } catch (error) {
      console.error('Update Invoice Error:', error);
      res.status(500).json({ success: false, message: 'Failed to update invoice', error: error.message });
    }
  },

  deleteInvoice: async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Invoice ID is required.' });
      }
      await PurchaseInvoice.deleteInvoice(id);
      await logUserActivity(req, {
        model_name: 'purchase_invoices',
        action_type: 'DELETE',
        record_id: id,
        description: 'Deleted purchase invoice'
      });
      res.status(200).json({ success: true, message: 'Invoice deleted successfully' });
    } catch (error) {
      console.error('Error deleting invoice:', error);
      res.status(500).json({ success: false, message: 'Failed to delete invoice', error: error.message });
    }
  },

  getInventoryDetailsByCodeUser: async (req, res) => {
    try {
      const { code_user } = req.body;
      if (!code_user) {
        return res.status(400).json({ success: false, message: 'Item code is required.' });
      }
      const details = await PurchaseInvoice.getDetailsByCodeUser(code_user);
      if (details) {
        res.status(200).json({ success: true, data: details });
      } else {
        res.status(404).json({ success: false, message: 'Item not found.' });
      }
    } catch (error) {
      console.error('Error getting inventory details:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },
  getInvoiceSummaries: async (req, res) => {
    try {
      const summaries = await PurchaseInvoice.findAllWithTotalAmount();
      res.status(200).json({ success: true, data: summaries });
    } catch (error) {
      console.error('Error fetching invoice summaries:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },
  getUserCode: async (req, res) => {
    try {
      const { user } = req.body;

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'User parameter is required'
        });
      }

      const codeUsers = await PurchaseInvoice.findCodeUserByUser(user);

      if (codeUsers.length > 0) {
        res.status(200).json({
          success: true,
          data: codeUsers  // Just the array of code_user values
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'User not found in inventory items'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  undoInvoice: async (req, res) => {
    try {
      const { id, reason } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Purchase invoice ID is required in the body.' });
      }

      const result = await PurchaseInvoice.undoInvoice(id, req.user?.id || null, reason || null);

      if (!result.success) {
        return res.status(404).json({ success: false, message: 'Purchase invoice not found' });
      }

      await logUserActivity(req, {
        model_name: 'purchase_invoices',
        action_type: 'DELETE',
        record_id: id,
        description: `Undo purchase invoice ${result.invoice_number || id}${reason ? `: ${reason}` : ''}`
      });

      res.status(200).json({
        success: true,
        message: 'Purchase invoice undo completed successfully.',
        data: result
      });
    } catch (error) {
      console.error('Error undoing purchase invoice:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  // Batch delete multiple purchase invoices
  batchDeleteInvoices: async (req, res) => {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ success: false, message: 'Request body must contain ids array.' });
      }

      let deletedCount = 0;
      const failed = [];

      for (const id of ids) {
        try {
          await PurchaseInvoice.deleteInvoice(id);
          deletedCount++;
          await logUserActivity(req, {
            model_name: 'purchase_invoices',
            action_type: 'DELETE',
            record_id: id,
            description: 'Deleted purchase invoice (batch)'
          });
        } catch (error) {
          failed.push({ id, message: error.message });
        }
      }

      res.status(200).json({ success: true, deletedCount, failed });

    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

};

module.exports = purchaseInvoiceController;