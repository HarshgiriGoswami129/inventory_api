const PatiTable = require('../model/pati_model');

const patiController = {

  createPati: async (req, res) => {
    try {
      const created_by = req.user.id;
      const newPati = await PatiTable.create({ ...req.body, created_by });
      res.status(201).json({ success: true, data: newPati });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  getAllPati: async (req, res) => {
    try {
      const patiItems = await PatiTable.findAll();
      res.status(200).json({
        success: true,
        data: patiItems
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  updatePati: async (req, res) => {
    try {
      const { id, ...patiData } = req.body;
      
      if (!id) {
        return res.status(400).json({ success: false, message: 'Pati ID is required in the body.' });
      }

      const affectedRows = await PatiTable.update(id, patiData);
      
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Pati item not found' });
      }

      res.status(200).json({ success: true, message: 'Pati item updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  deletePati: async (req, res) => {
    try {
      const { id } = req.body;
      
      if (!id) {
        return res.status(400).json({ success: false, message: 'Pati ID is required in the body.' });
      }

      const affectedRows = await PatiTable.delete(id);
      
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Pati item not found' });
      }

      res.status(200).json({ success: true, message: 'Pati item deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  getPatiTypes: async (req, res) => {
    try {
      const patiTypes = await PatiTable.findAllPatiTypes();
      res.status(200).json({ success: true, data: patiTypes });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

};

module.exports = patiController;
