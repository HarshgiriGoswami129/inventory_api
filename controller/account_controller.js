const Account = require('../model/account_model');
const accountController = {
  createAccount: async (req, res) => {
    try {
      const created_by = req.user.id; // Use real user ID
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
  }
};
module.exports = accountController;