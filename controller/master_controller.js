const MasterItem = require('../model/master_model');
const masterController = {
  createItem: async (req, res) => {
    try {
      const created_by = req.user.id;
      const newItem = await MasterItem.create({ ...req.body, created_by });
      res.status(201).json({ success: true, data: newItem });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  getAllItems: async (req, res) => {
  try {
    // Fetch data from both tables in parallel
    const [items, cartons] = await Promise.all([
      MasterItem.findAll(),
      MasterItem.findAllCorton()
    ]);
    
    // Combine them in the response JSON
    res.status(200).json({ 
      success: true, 
      data: {
        masterItems: items,
        cartonInventory: cartons
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
},

  updateItem: async (req, res) => {
    try {
      // Get ID from the request body
      const { id, ...itemData } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Item ID is required in the body.' });
      }
      const affectedRows = await MasterItem.update(id, itemData);
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
      // Get ID from the request body
      const { id } = req.body;
       if (!id) {
        return res.status(400).json({ success: false, message: 'Item ID is required in the body.' });
      }
      const affectedRows = await MasterItem.delete(id);
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }
      res.status(200).json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },
  getItemCodes: async (req, res) => {
    try {
        const itemCodes = await MasterItem.findAllItemCodes();
        res.status(200).json({ success: true, data: itemCodes });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
},  
};
module.exports = masterController;