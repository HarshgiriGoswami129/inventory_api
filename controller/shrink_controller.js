const ShrinkInventory = require('../model/shrink_inventory_model');

const getAllShrink = async (req, res) => {
  try {
    const items = await ShrinkInventory.findAll();
    return res.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching shrink:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllShrinkNames = async (req, res) => {
  try {
    const items = await ShrinkInventory.findAllShrinkNames();
    return res.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching shrink names:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const addShrink = async (req, res) => {
  try {
    const { shrink_name, shrink_quantity, shrink_wt, created_by } = req.body;
    if (!shrink_name) {
      return res.status(400).json({ success: false, message: 'Shrink name is required' });
    }
    const newShrink = await ShrinkInventory.create({
      shrink_name,
      shrink_quantity: parseFloat(shrink_quantity) || 0,
      shrink_wt: parseFloat(shrink_wt) || 0,
      created_by: created_by || null,
    });
    return res.status(201).json({ success: true, message: 'Shrink created successfully', data: newShrink });
  } catch (error) {
    console.error('Error adding shrink:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateShrink = async (req, res) => {
  try {
    const { id } = req.params;
    const { shrink_name, shrink_quantity, shrink_wt } = req.body;
    const affected = await ShrinkInventory.update(id, {
      shrink_name,
      shrink_quantity: parseFloat(shrink_quantity) || 0,
      shrink_wt: parseFloat(shrink_wt) || 0,
    });
    if (affected > 0) {
      return res.json({ success: true, message: 'Shrink updated successfully' });
    }
    return res.status(404).json({ success: false, message: 'Shrink not found' });
  } catch (error) {
    console.error('Error updating shrink:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const batchUpdateShrink = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Items array required' });
    }
    for (const b of items) {
      if (b.id) {
        await ShrinkInventory.update(b.id, {
          shrink_name: b.shrink_name,
          shrink_quantity: parseFloat(b.shrink_quantity) || 0,
          shrink_wt: parseFloat(b.shrink_wt) || 0,
        });
      }
    }
    return res.json({ success: true, message: 'Shrink items updated successfully' });
  } catch (error) {
    console.error('Error batch updating shrink:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteShrink = async (req, res) => {
  try {
    const { id } = req.params;
    const affected = await ShrinkInventory.delete(id);
    if (affected > 0) {
      return res.json({ success: true, message: 'Shrink deleted successfully' });
    }
    return res.status(404).json({ success: false, message: 'Shrink not found' });
  } catch (error) {
    console.error('Error deleting shrink:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllShrink,
  getAllShrinkNames,
  addShrink,
  updateShrink,
  batchUpdateShrink,
  deleteShrink,
};
