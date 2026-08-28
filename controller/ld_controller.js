const LdInventory = require('../model/ld_inventory_model');

const getAllLd = async (req, res) => {
  try {
    const items = await LdInventory.findAll();
    return res.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching LD:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllLdNames = async (req, res) => {
  try {
    const items = await LdInventory.findAllLdNames();
    return res.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching LD names:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const addLd = async (req, res) => {
  try {
    const { ld_name, ld_quantity, ld_wt, created_by } = req.body;
    if (!ld_name) {
      return res.status(400).json({ success: false, message: 'LD name is required' });
    }
    const newLd = await LdInventory.create({
      ld_name,
      ld_quantity: parseFloat(ld_quantity) || 0,
      ld_wt: parseFloat(ld_wt) || 0,
      created_by: created_by || null,
    });
    return res.status(201).json({ success: true, message: 'LD created successfully', data: newLd });
  } catch (error) {
    console.error('Error adding LD:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateLd = async (req, res) => {
  try {
    const { id } = req.params;
    const { ld_name, ld_quantity, ld_wt } = req.body;
    const affected = await LdInventory.update(id, {
      ld_name,
      ld_quantity: parseFloat(ld_quantity) || 0,
      ld_wt: parseFloat(ld_wt) || 0,
    });
    if (affected > 0) {
      return res.json({ success: true, message: 'LD updated successfully' });
    }
    return res.status(404).json({ success: false, message: 'LD not found' });
  } catch (error) {
    console.error('Error updating LD:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const batchUpdateLd = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Items array required' });
    }
    for (const b of items) {
      if (b.id) {
        await LdInventory.update(b.id, {
          ld_name: b.ld_name,
          ld_quantity: parseFloat(b.ld_quantity) || 0,
          ld_wt: parseFloat(b.ld_wt) || 0,
        });
      }
    }
    return res.json({ success: true, message: 'LD items updated successfully' });
  } catch (error) {
    console.error('Error batch updating LD:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteLd = async (req, res) => {
  try {
    const { id } = req.params;
    const affected = await LdInventory.delete(id);
    if (affected > 0) {
      return res.json({ success: true, message: 'LD deleted successfully' });
    }
    return res.status(404).json({ success: false, message: 'LD not found' });
  } catch (error) {
    console.error('Error deleting LD:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllLd,
  getAllLdNames,
  addLd,
  updateLd,
  batchUpdateLd,
  deleteLd,
};
