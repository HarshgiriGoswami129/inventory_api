const InventoryItem = require('../model/inventory_model');
const inventoryController = {
  createItem: async (req, res) => {
    try {
      const created_by = req.user.id;
      const newItem = await InventoryItem.create({ ...req.body, created_by });
      res.status(201).json({ success: true, data: newItem });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  getAllItems: async (req, res) => {
    try {
      const items = await InventoryItem.findAll();
      res.status(200).json({ success: true, data: items });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  updateItem: async (req, res) => {
    try {
      const affectedRows = await InventoryItem.update(req.params.id, req.body);
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }
      res.status(200).json({ success: true, message: 'Item updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  deleteItem: async (req, res) => {
    try {
      const affectedRows = await InventoryItem.delete(req.params.id);
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }
      res.status(200).json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  }
};
module.exports = inventoryController;