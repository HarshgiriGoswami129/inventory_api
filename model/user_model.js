const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  findByEmail: async (email) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  // --- MODIFIED create function ---
  create: async (userData) => {
    const { user_name, email, password, permissions } = userData;
    const connection = await db.getConnection();

    try {
      // Start a transaction
      await connection.beginTransaction();

      // 1. Create the user
      const hashedPassword = await bcrypt.hash(password, 10);
      const userQuery = 'INSERT INTO users (user_name, email, password) VALUES (?, ?, ?)';
      const [result] = await connection.query(userQuery, [user_name, email, hashedPassword]);
      const userId = result.insertId;

      // 2. Insert permissions if they exist
      if (permissions && permissions.length > 0) {
        const permissionQuery = 'INSERT INTO user_permissions (user_id, permission_name) VALUES ?';
        // Format data for bulk insert: [[userId, 'receipts'], [userId, 'payments']]
        const permissionValues = permissions.map(p => [userId, p]);
        await connection.query(permissionQuery, [permissionValues]);
      }

      // If everything is successful, commit the transaction
      await connection.commit();
      return { id: userId, user_name, email };

    } catch (error) {
      await connection.rollback();
      throw error; // Let the controller handle the error
    } finally {
      connection.release();
    }
  },

  // --- NEW function to get permissions ---
  findPermissionsByUserId: async (userId) => {
    const query = 'SELECT permission_name FROM user_permissions WHERE user_id = ?';
    const [rows] = await db.query(query, [userId]);
    // Return an array of strings, e.g., ['receipts', 'payments']
    return rows.map(row => row.permission_name);
  }
};

module.exports = User;