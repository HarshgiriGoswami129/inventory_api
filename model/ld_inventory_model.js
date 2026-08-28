const db = require('../config/db');

const LdInventory = {
  // Ensure table exists
  initTable: async () => {
    try {
      const createQuery = `
        CREATE TABLE IF NOT EXISTS ld_inventory (
          id INT AUTO_INCREMENT PRIMARY KEY,
          ld_name VARCHAR(255) NOT NULL,
          ld_quantity DECIMAL(12,4) DEFAULT 0,
          ld_wt DECIMAL(10,4) DEFAULT 0,
          created_by INT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `;
      await db.query(createQuery);
    } catch (err) {
      console.error('Error initializing ld_inventory table:', err);
    }
  },

  create: async (ldData) => {
    await LdInventory.initTable();
    const { ld_name, ld_quantity, ld_wt, created_by } = ldData;
    const query = 'INSERT INTO ld_inventory (ld_name, ld_quantity, ld_wt, created_by) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(query, [ld_name, ld_quantity || 0, ld_wt || 0, created_by || null]);
    return { id: result.insertId, ...ldData };
  },

  findAllLdNames: async () => {
    await LdInventory.initTable();
    const [rows] = await db.query('SELECT ld_name, ld_wt, ld_quantity FROM ld_inventory');
    return rows;
  },

  findAll: async () => {
    await LdInventory.initTable();
    const [rows] = await db.query('SELECT * FROM ld_inventory ORDER BY id DESC');
    return rows;
  },

  findById: async (id) => {
    await LdInventory.initTable();
    const [rows] = await db.query('SELECT * FROM ld_inventory WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  update: async (id, ldData) => {
    await LdInventory.initTable();
    const { ld_name, ld_quantity, ld_wt } = ldData;
    const query = 'UPDATE ld_inventory SET ld_name = ?, ld_quantity = ?, ld_wt = ? WHERE id = ?';
    const [result] = await db.query(query, [ld_name, ld_quantity || 0, ld_wt || 0, id]);
    return result.affectedRows;
  },

  incrementQuantity: async (ldName, qty) => {
    await LdInventory.initTable();
    const query = `
      UPDATE ld_inventory 
      SET ld_quantity = ld_quantity + ? 
      WHERE ld_name = ?
    `;
    const [result] = await db.query(query, [qty, ldName]);
    return result.affectedRows;
  },

  delete: async (id) => {
    await LdInventory.initTable();
    const query = 'DELETE FROM ld_inventory WHERE id = ?';
    const [result] = await db.query(query, [id]);
    return result.affectedRows;
  },
};

module.exports = LdInventory;
