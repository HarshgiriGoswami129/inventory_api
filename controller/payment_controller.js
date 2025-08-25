const Payment = require('../model/payment_model');

const paymentController = {
  createPayment: async (req, res) => {
    try {
      const user_id = req.user.id;
      const image_url = req.file ? req.file.path : null;

      const paymentData = {
        ...req.body,
        image_url: image_url,
        user_id: user_id
      };

      const newPayment = await Payment.create(paymentData);
      res.status(201).json({ success: true, message: "Payment created and account balance updated.", data: newPayment });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },
  getAllPayments: async (req, res) => {
    try {
      const payments = await Payment.findAll();
      res.status(200).json({ success: true, data: payments });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  }
};
module.exports = paymentController;
