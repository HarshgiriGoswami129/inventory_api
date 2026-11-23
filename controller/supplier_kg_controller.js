const SupplierKGDeduction = require('../model/supplier_kg_model');
const { recalculateSupplierKGBalances } = require('../utils/supplier_balance_helper');
const { logUserActivity } = require('../utils/activityLogger');

const supplierKGController = {
  createDeduction: async (req, res) => {
    try {
      const { contact_id, date, net_kg, notes } = req.body;
      if (!contact_id) {
        return res.status(400).json({ success: false, message: 'Supplier is required' });
      }
      if (!net_kg || parseFloat(net_kg) <= 0) {
        return res.status(400).json({ success: false, message: 'Net KG must be greater than 0' });
      }

      const result = await SupplierKGDeduction.create({
        contact_id,
        date,
        net_kg,
        notes
      });

      if (logUserActivity) {
        try {
          await logUserActivity(req, {
            model_name: 'supplier_kg_deductions',
            action_type: 'CREATE',
            record_id: result.id,
            description: `Deducted ${net_kg} Net KG for supplier ${contact_id}`
          });
        } catch (e) {
          console.warn('Activity log failed:', e.message);
        }
      }

      res.status(201).json({
        success: true,
        message: 'Net KG deduction recorded successfully',
        data: result
      });
    } catch (error) {
      console.error('Error creating Net KG deduction:', error);
      res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
  },

  getAllDeductions: async (req, res) => {
    try {
      const options = {
        contact_id: req.body.contact_id || req.query.contact_id || null,
        page: parseInt(req.body.page || req.query.page || 1, 10),
        limit: parseInt(req.body.limit || req.query.limit || 50, 10),
        search: req.body.search || req.query.search || ''
      };

      const result = await SupplierKGDeduction.getAll(options);
      res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
          limit: options.limit
        }
      });
    } catch (error) {
      console.error('Error getting Net KG deductions:', error);
      res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
  },

  getDeductionById: async (req, res) => {
    try {
      const id = req.params.id || req.body.id;
      const deduction = await SupplierKGDeduction.getById(id);
      if (!deduction) {
        return res.status(404).json({ success: false, message: 'Deduction not found' });
      }
      res.status(200).json({ success: true, data: deduction });
    } catch (error) {
      console.error('Error getting Net KG deduction:', error);
      res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
  },

  deleteDeduction: async (req, res) => {
    try {
      const id = req.params.id || req.body.id;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Deduction ID is required' });
      }

      const result = await SupplierKGDeduction.delete(id);

      if (logUserActivity) {
        try {
          await logUserActivity(req, {
            model_name: 'supplier_kg_deductions',
            action_type: 'DELETE',
            record_id: id,
            description: `Deleted Net KG deduction ${id}`
          });
        } catch (e) {
          console.warn('Activity log failed:', e.message);
        }
      }

      res.status(200).json({
        success: true,
        message: 'Net KG deduction deleted and balances recalculated',
        data: result
      });
    } catch (error) {
      console.error('Error deleting Net KG deduction:', error);
      res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
  },

  recalculateBalances: async (req, res) => {
    try {
      const contact_id = req.body.contact_id || req.params.contact_id;
      if (!contact_id) {
        return res.status(400).json({ success: false, message: 'contact_id is required' });
      }
      const result = await recalculateSupplierKGBalances(contact_id);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error('Error recalculating KG balances:', error);
      res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
  }
};

module.exports = supplierKGController;
