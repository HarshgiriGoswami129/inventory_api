const Receipt = require('../model/receipt_model');

const receiptController = {
  createReceipt: async (req, res) => {
    try {
      const user_id = req.user.id;
      const image_url = req.file ? req.file.path : null;

      const receiptData = {
        ...req.body,
        image_url: image_url,
        user_id: user_id
      };

      const newReceipt = await Receipt.create(receiptData);
      res.status(201).json({ success: true, message: "Receipt created and account balance updated.", data: newReceipt });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },
  getAllReceipts: async (req, res) => {
    try {
      const receipts = await Receipt.findAll();
      res.status(200).json({ success: true, data: receipts });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  }
};
module.exports = receiptController;