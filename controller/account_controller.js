const Account = require('../model/account_model');

const accountController = {
  createAccount: async (req, res) => {
    try {
      const created_by = req.user.id;
      const newAccount = await Account.create({ ...req.body, created_by });
      res.status(201).json({ success: true, data: newAccount });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  getAllAccounts: async (req, res) => {
    try {
      const accounts = await Account.findAll();
      res.status(200).json({ success: true, data: accounts });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  // --- NEW: Controller for updating an account ---
  updateAccount: async (req, res) => {
    try {
      const { id, ...accountData } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Account ID is required in the body.' });
      }
      const affectedRows = await Account.update(id, accountData);
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Account not found' });
      }
      res.status(200).json({ success: true, message: 'Account updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  // --- NEW: Controller for deleting an account ---
  deleteAccount: async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Account ID is required in the body.' });
      }
      const affectedRows = await Account.delete(id);
      if (affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Account not found' });
      }
      res.status(200).json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  }
};
module.exports = accountController;