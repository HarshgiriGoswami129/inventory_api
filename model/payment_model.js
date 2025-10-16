const db = require('../config/db');
const Payment = {
  create: async (paymentData) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Destructure payment data
      const { date, amount, account_id, contact_id, description, reference, note, image_url, user_id } = paymentData;

      // 1. Insert the new payment record (existing logic)
      const paymentQuery = 'INSERT INTO payments (date, amount, account_id, contact_id, description, reference, note, image_url, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const [paymentResult] = await connection.query(paymentQuery, [date, amount, account_id, contact_id, description, reference, note, image_url, user_id]);

      // 2. Update the account balance (existing logic)
      const updateAccountQuery = 'UPDATE accounts SET balance = balance - ? WHERE id = ?';
      await connection.query(updateAccountQuery, [amount, account_id]);

      // 3. ✨ NEW: Update the supplier's total_amount if contact_id exists
      if (contact_id) {
        const updateSupplierQuery = 'UPDATE supplier_details SET total_amount = total_amount - ? WHERE contact_id = ?';
        await connection.query(updateSupplierQuery, [amount, contact_id]);
      }

      await connection.commit();
      return { id: paymentResult.insertId, ...paymentData };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM payments');
    return rows;
  },
  update: async (id, updateData) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Build SET part dynamically for update fields
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(updateData)) {
      if (key !== 'id' && value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    values.push(id);

    const updateQuery = `UPDATE payments SET ${fields.join(', ')} WHERE id = ?`;
    await connection.query(updateQuery, values);

    const [rows] = await connection.query('SELECT * FROM payments WHERE id = ?', [id]);
    await connection.commit();

    return rows[0];
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
},

delete: async (id) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const deleteQuery = 'DELETE FROM payments WHERE id = ?';
    await connection.query(deleteQuery, [id]);
    await connection.commit();
    return;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
},

};
module.exports = Payment;