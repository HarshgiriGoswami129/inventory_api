const db = require('../config/db');

const BoxInventory = {
  // Ensure table exists
  initTable: async () => {
    try {
      const createQuery = `
        CREATE TABLE IF NOT EXISTS box_inventory (
          id INT AUTO_INCREMENT PRIMARY KEY,
          box_name VARCHAR(255) NOT NULL,
          box_quantity DECIMAL(12,4) DEFAULT 0,
          box_wt DECIMAL(10,4) DEFAULT 0,
          created_by INT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `;
      await db.query(createQuery);
    } catch (err) {
      console.error('Error initializing box_inventory table:', err);
    }
  },

  create: async (boxData) => {
    await BoxInventory.initTable();
    const { box_name, box_quantity, box_wt, created_by } = boxData;
    const query = 'INSERT INTO box_inventory (box_name, box_quantity, box_wt, created_by) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(query, [box_name, box_quantity || 0, box_wt || 0, created_by || null]);
    return { id: result.insertId, ...boxData };
  },

  findAllBoxNames: async () => {
    await BoxInventory.initTable();
    const [rows] = await db.query('SELECT box_name, box_wt, box_quantity FROM box_inventory');
    return rows;
  },

  findAll: async () => {
    await BoxInventory.initTable();
    const [rows] = await db.query('SELECT * FROM box_inventory ORDER BY id DESC');
    return rows;
  },

  findById: async (id) => {
    await BoxInventory.initTable();
    const [rows] = await db.query('SELECT * FROM box_inventory WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  update: async (id, boxData) => {
    await BoxInventory.initTable();
    const { box_name, box_quantity, box_wt } = boxData;
    const query = 'UPDATE box_inventory SET box_name = ?, box_quantity = ?, box_wt = ? WHERE id = ?';
    const [result] = await db.query(query, [box_name, box_quantity || 0, box_wt || 0, id]);
    return result.affectedRows;
  },

  incrementQuantity: async (boxName, qty) => {
    await BoxInventory.initTable();
    const query = `
      UPDATE box_inventory 
      SET box_quantity = box_quantity + ? 
      WHERE box_name = ?
    `;
    const [result] = await db.query(query, [qty, boxName]);
    return result.affectedRows;
  },

  delete: async (id) => {
    await BoxInventory.initTable();
    const query = 'DELETE FROM box_inventory WHERE id = ?';
    const [result] = await db.query(query, [id]);
    return result.affectedRows;
  },
};

module.exports = BoxInventory;
