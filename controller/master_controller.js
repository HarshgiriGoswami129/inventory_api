const MasterItem = require('../model/master_model');
const { logUserActivity } = require('../utils/activityLogger');
const { compareChanges } = require('../utils/compareChanges');

const masterController = {
  createItem: async (req, res) => {
    try {
      const created_by = req.user.id;
      const newItem = await MasterItem.create({ ...req.body, created_by });
      await logUserActivity(req, {
        model_name: 'master_items',
        action_type: 'CREATE',
        record_id: newItem.id,
        description: 'Created master item'
      });
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
      
      // Fetch old record before updating
      const oldRecord = await MasterItem.findById(id);
      if (!oldRecord) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }
      
      const affectedRows = await MasterItem.update(id, itemData);
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Item not found' });
      }
      
      // Compare old vs new values and log changes
      const changes = compareChanges(oldRecord, itemData);
      await logUserActivity(req, {
        model_name: 'master_items',
        action_type: 'UPDATE',
        record_id: id,
        description: 'Updated master item',
        changes: changes
      });
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
      await logUserActivity(req, {
        model_name: 'master_items',
        action_type: 'DELETE',
        record_id: id,
        description: 'Deleted master item'
      });
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
getAllItemsPaginated: async (req, res) => {
    try {
      let { page, page_limit } = req.body;

      // Validate page
      page = parseInt(page, 10);
      if (isNaN(page) || page < 1) {
        page = 1;
      }

      // Validate page_limit, default 20
      page_limit = parseInt(page_limit, 10);
      if (isNaN(page_limit) || page_limit <= 0) {
        page_limit = 20;
      }

      const offset = (page - 1) * page_limit;

      const [masterItems, total] = await Promise.all([
        MasterItem.findPaginated(page_limit, offset),
        MasterItem.countAll()
      ]);

      const totalPages = Math.ceil(total / page_limit);

      // Option A: only master items in this API
      return res.status(200).json({
        success: true,
        data: {
          masterItems
        },
        meta: {
          page,
          page_limit,
          total_records: total,
          total_pages: totalPages
        }
      });

      // If you want cartonInventory here too, you can additionally fetch
      // const cartons = await MasterItem.findAllCorton();
      // and include cartonInventory: cartons in data.
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: 'Server Error', error: error.message });
    }
  },
};
module.exports = masterController;