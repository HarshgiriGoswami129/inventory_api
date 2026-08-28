const db = require('../config/db');

const ShrinkInventory = {
  // Ensure table exists
  initTable: async () => {
    try {
      const createQuery = `
        CREATE TABLE IF NOT EXISTS shrink_inventory (
          id INT AUTO_INCREMENT PRIMARY KEY,
          shrink_name VARCHAR(255) NOT NULL,
          shrink_quantity DECIMAL(12,4) DEFAULT 0,
          shrink_wt DECIMAL(10,4) DEFAULT 0,
          created_by INT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `;
      await db.query(createQuery);
    } catch (err) {
      console.error('Error initializing shrink_inventory table:', err);
    }
  },

  create: async (shrinkData) => {
    await ShrinkInventory.initTable();
    const { shrink_name, shrink_quantity, shrink_wt, created_by } = shrinkData;
    const query = 'INSERT INTO shrink_inventory (shrink_name, shrink_quantity, shrink_wt, created_by) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(query, [shrink_name, shrink_quantity || 0, shrink_wt || 0, created_by || null]);
    return { id: result.insertId, ...shrinkData };
  },

  findAllShrinkNames: async () => {
    await ShrinkInventory.initTable();
    const [rows] = await db.query('SELECT shrink_name, shrink_wt, shrink_quantity FROM shrink_inventory');
    return rows;
  },

  findAll: async () => {
    await ShrinkInventory.initTable();
    const [rows] = await db.query('SELECT * FROM shrink_inventory ORDER BY id DESC');
    return rows;
  },

  findById: async (id) => {
    await ShrinkInventory.initTable();
    const [rows] = await db.query('SELECT * FROM shrink_inventory WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  update: async (id, shrinkData) => {
    await ShrinkInventory.initTable();
    const { shrink_name, shrink_quantity, shrink_wt } = shrinkData;
    const query = 'UPDATE shrink_inventory SET shrink_name = ?, shrink_quantity = ?, shrink_wt = ? WHERE id = ?';
    const [result] = await db.query(query, [shrink_name, shrink_quantity || 0, shrink_wt || 0, id]);
    return result.affectedRows;
  },

  incrementQuantity: async (shrinkName, qty) => {
    await ShrinkInventory.initTable();
    const query = `
      UPDATE shrink_inventory 
      SET shrink_quantity = shrink_quantity + ? 
      WHERE shrink_name = ?
    `;
    const [result] = await db.query(query, [qty, shrinkName]);
    return result.affectedRows;
  },

  delete: async (id) => {
    await ShrinkInventory.initTable();
    const query = 'DELETE FROM shrink_inventory WHERE id = ?';
    const [result] = await db.query(query, [id]);
    return result.affectedRows;
  },
};

module.exports = ShrinkInventory;
