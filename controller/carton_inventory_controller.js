const CartonInventory = require('../model/carton_inventory_model');
const { logUserActivity } = require('../utils/activityLogger');

const cartonInventoryController = {
  /**
   * Handles the creation of a new carton.
   */
  addCarton: async (req, res) => {
    try {
      const created_by = req.user.id; // Get user ID from auth middleware
      const { carton_name, carton_quantity } = req.body;

      // Basic validation
      if (!carton_name || carton_quantity === undefined) {
        return res.status(400).json({ success: false, message: 'Carton name and quantity are required.' });
      }

      const newCarton = await CartonInventory.create({ carton_name, carton_quantity, created_by });
      await logUserActivity(req, {
        model_name: 'carton_inventory',
        action_type: 'CREATE',
        record_id: newCarton.id,
        description: `Created carton ${carton_name}`
      });
      res.status(201).json({ success: true, message: 'Carton added successfully!', data: newCarton });

    } catch (error) {
      // Handle unique constraint violation for 'carton_name'
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, message: 'A carton with this name already exists.' });
      }
      // Handle other server errors
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },
  getCartonNames: async (req, res) => {
  try {
    const cartonNames = await CartonInventory.findAllCartonNames();
    res.status(200).json({
      success: true,
      data: cartonNames
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
},
getAllCartonsPaginated: async (req, res) => {
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

      const [cartons, total] = await Promise.all([
        CartonInventory.findPaginated(page_limit, offset),
        CartonInventory.countAll()
      ]);

      const totalPages = Math.ceil(total / page_limit);

      return res.status(200).json({
        success: true,
        data: cartons,
        meta: {
          page,
          page_limit,
          total_records: total,
          total_pages: totalPages
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  }


  // You can add getAllCartons, updateCarton, etc. functions here later
};

module.exports = cartonInventoryController;