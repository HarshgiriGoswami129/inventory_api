const db = require('../config/db');
const Receipt = {
  create: async (receiptData) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      // Destructure image_url from the data
      const { date, amount, contact_id, account_id, description, reference, note, image_url, user_id } = receiptData;
      // Add image_url to the INSERT query
      const receiptQuery = 'INSERT INTO receipts (date, amount, contact_id, account_id, description, reference, note, image_url, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const [receiptResult] = await connection.query(receiptQuery, [date, amount, contact_id, account_id, description, reference, note, image_url, user_id]);

      const updateAccountQuery = 'UPDATE accounts SET balance = balance + ? WHERE id = ?';
      await connection.query(updateAccountQuery, [amount, account_id]);

      await connection.commit();
      return { id: receiptResult.insertId, ...receiptData };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM receipts');
    return rows;
  }
};
module.exports = Receipt;