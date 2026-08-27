const BoxInventory = require('../model/box_inventory_model');

const getAllBoxes = async (req, res) => {
  try {
    const boxes = await BoxInventory.findAll();
    return res.json({ success: true, data: boxes });
  } catch (error) {
    console.error('Error fetching boxes:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllBoxNames = async (req, res) => {
  try {
    const boxes = await BoxInventory.findAllBoxNames();
    return res.json({ success: true, data: boxes });
  } catch (error) {
    console.error('Error fetching box names:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const addBox = async (req, res) => {
  try {
    const { box_name, box_quantity, box_wt, created_by } = req.body;
    if (!box_name) {
      return res.status(400).json({ success: false, message: 'Box name is required' });
    }
    const newBox = await BoxInventory.create({
      box_name,
      box_quantity: parseFloat(box_quantity) || 0,
      box_wt: parseFloat(box_wt) || 0,
      created_by: created_by || null,
    });
    return res.status(201).json({ success: true, message: 'Box created successfully', data: newBox });
  } catch (error) {
    console.error('Error adding box:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateBox = async (req, res) => {
  try {
    const { id } = req.params;
    const { box_name, box_quantity, box_wt } = req.body;
    const affected = await BoxInventory.update(id, {
      box_name,
      box_quantity: parseFloat(box_quantity) || 0,
      box_wt: parseFloat(box_wt) || 0,
    });
    if (affected > 0) {
      return res.json({ success: true, message: 'Box updated successfully' });
    }
    return res.status(404).json({ success: false, message: 'Box not found' });
  } catch (error) {
    console.error('Error updating box:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const batchUpdateBox = async (req, res) => {
  try {
    const { boxes } = req.body;
    if (!Array.isArray(boxes)) {
      return res.status(400).json({ success: false, message: 'Boxes array required' });
    }
    for (const b of boxes) {
      if (b.id) {
        await BoxInventory.update(b.id, {
          box_name: b.box_name,
          box_quantity: parseFloat(b.box_quantity) || 0,
          box_wt: parseFloat(b.box_wt) || 0,
        });
      }
    }
    return res.json({ success: true, message: 'Box items updated successfully' });
  } catch (error) {
    console.error('Error batch updating boxes:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBox = async (req, res) => {
  try {
    const { id } = req.params;
    const affected = await BoxInventory.delete(id);
    if (affected > 0) {
      return res.json({ success: true, message: 'Box deleted successfully' });
    }
    return res.status(404).json({ success: false, message: 'Box not found' });
  } catch (error) {
    console.error('Error deleting box:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllBoxes,
  getAllBoxNames,
  addBox,
  updateBox,
  batchUpdateBox,
  deleteBox,
};
