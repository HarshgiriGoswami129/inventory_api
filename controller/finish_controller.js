const Finishes = require('../model/finish_model');

const finishesController = {
  addFinish: async (req, res) => {
    try {
      const { finish } = req.body;
      const newFinish = await Finishes.create(finish);
      res.status(201).json({ success: true, data: newFinish });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getFinishes: async (req, res) => {
    try {
      const finishes = await Finishes.getAll();
      res.status(200).json({ success: true, data: finishes });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updateFinish: async (req, res) => {
    try {
      const { id, finish } = req.body;
      const affectedRows = await Finishes.update(id, finish);
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Finish not found' });
      }
      res.status(200).json({ success: true, message: 'Finish updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteFinish: async (req, res) => {
    try {
      const { id } = req.body;
      const affectedRows = await Finishes.delete(id);
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Finish not found' });
      }
      res.status(200).json({ success: true, message: 'Finish deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = finishesController;
