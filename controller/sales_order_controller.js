const SalesOrder = require('../model/sales_order_model');
const db = require('../config/db');

const salesOrderController = {
  createOrder: async (req, res) => {
    try {
      const created_by = req.user.id;
      if (!created_by) {
        return res.status(400).json({ success: false, message: 'Created by user ID is required.' });
      }
      // Map incoming fields to match model expectations
      const orderData = {
        ...req.body,
        order_date: req.body.date, // Map 'date' to 'order_date'
        rate_kz: req.body.rate_kz, // Map 'rate_kg' to 'rate_kz'
        created_by
      };
      const newOrder = await SalesOrder.create(orderData);
      res.status(201).json({ success: true, data: newOrder });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  getAllOrders: async (req, res) => {
    try {
      const orders = await SalesOrder.findAll();
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  updateOrder: async (req, res) => {
    try {
      const { id, ...orderData } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Order ID is required in the body.' });
      }
      // Map incoming fields to match model expectations
      const mappedData = {
        ...orderData,
        order_date: orderData.date,
        rate_kz: orderData.rate_kz
      };
      const affectedRows = await SalesOrder.update(id, mappedData);
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Sales order not found' });
      }
      res.status(200).json({ success: true, message: 'Sales order updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  deleteOrder: async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Order ID is required in the body.' });
      }
      const affectedRows = await SalesOrder.delete(id);
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Sales order not found' });
      }
      res.status(200).json({ success: true, message: 'Sales order deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },
  batchUpdateOrders: async (req, res) => {
    try {
      const orders = req.body;

      if (!Array.isArray(orders) || orders.length === 0) {
        return res.status(400).json({ success: false, message: "Request body must be a non-empty array." });
      }

      const failed = [];
      const success = [];

      for (const orderData of orders) {
        const { id, ...fieldsToUpdate } = orderData;
        if (!id) {
          failed.push({ id: null, message: "Missing id in update object" });
          continue;
        }

        // Map incoming fields to match model expectations
        const mappedData = {
          ...fieldsToUpdate,
          order_date: fieldsToUpdate.date,
          rate_kz: fieldsToUpdate.rate_kz
        };
        try {
          const affected = await SalesOrder.update(id, mappedData);
          if (affected === 0) {
            failed.push({ id, message: "Sales order not found" });
          } else {
            success.push({ id });
          }
        } catch (error) {
          failed.push({ id, message: error.message });
        }
      }

      res.status(200).json({ success: true, updated: success.length, failed });

    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  },

  batchDeleteOrders: async (req, res) => {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ success: false, message: "Request body must contain ids array." });
      }

      let deletedCount = 0;
      for (const id of ids) {
        try {
          const affected = await SalesOrder.delete(id);
          if (affected > 0) deletedCount++;
        } catch {
          // ignore individual failures or collect for reporting
        }
      }

      res.status(200).json({ success: true, deletedCount });

    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  },

  searchOrdersByUserName: async (req, res) => {
    try {
      const { user_name } = req.body;
      if (!user_name) {
        return res.status(400).json({ success: false, message: "user_name is required in request body" });
      }

      const [users] = await db.query('SELECT id FROM users WHERE user_name LIKE ?', [`%${user_name}%`]);
      if (users.length === 0) {
        return res.status(404).json({ success: false, message: "No user found with that name" });
      }
      const userIds = users.map(u => u.id);

      const orders = await SalesOrder.searchByUserIds(userIds);
      res.status(200).json({ success: true, data: orders });

    } catch (error) {
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  },

  getValidCodeUserList: async (req, res) => {
    try {
      const codeUserList = await SalesOrder.getValidCodeUserList();
      if (codeUserList.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No valid code_user found for customers'
        });
      }
      res.status(200).json({
        success: true,
        data: codeUserList,
        count: codeUserList.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  getValidCodeUserListForSuppliers: async (req, res) => {
    try {
      const codeUserList = await SalesOrder.getValidCodeUserListForSuppliers();

      if (codeUserList.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No valid code_user found for suppliers'
        });
      }

      res.status(200).json({
        success: true,
        data: codeUserList,
        count: codeUserList.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  getInventoryByCodeUser: async (req, res) => {
    try {
      const { code_user } = req.body;
      
      if (!code_user) {
        return res.status(400).json({
          success: false,
          message: 'code_user is required in request body'
        });
      }

      const inventoryItem = await SalesOrder.getInventoryByCodeUser(code_user);
      
      if (!inventoryItem) {
        return res.status(404).json({
          success: false,
          message: 'No inventory item found with this code_user'
        });
      }

      res.status(200).json({
        success: true,
        data: inventoryItem
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  },

  getSuppliersCodeAndName: async (req, res) => {
    try {
      const suppliers = await SalesOrder.getSuppliersCodeAndName();
      res.status(200).json({ success: true, data: suppliers });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  getStockByItemCode: async (req, res) => {
    try {
      const { item_code } = req.body;

      if (!item_code) {
        return res.status(400).json({ 
          success: false, 
          message: 'item_code is required in the request body.' 
        });
      }

      const item = await SalesOrder.findStockByItemCode(item_code);

      if (!item) {
        return res.status(404).json({ 
          success: false, 
          message: 'Item not found.' 
        });
      }

      res.status(200).json({ 
        success: true, 
        data: { stock_quantity: item.stock_quantity } 
      });

    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server Error', 
        error: error.message 
      });
    }
  },
};
module.exports = salesOrderController;