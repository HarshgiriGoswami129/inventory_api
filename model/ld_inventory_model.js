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
          ld_wt DECIMAL(10,6) DEFAULT 0,
          kg_dzn DECIMAL(10,4) DEFAULT 0,
          created_by INT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `;
      await db.query(createQuery);
      // Ensure kg_dzn column exists if table already existed
      try {
        await db.query('ALTER TABLE ld_inventory ADD COLUMN kg_dzn DECIMAL(10,4) DEFAULT 0');
      } catch (e) {
        // Ignore column exists error
      }
    } catch (err) {
      console.error('Error initializing ld_inventory table:', err);
    }
  },

  create: async (ldData) => {
    await LdInventory.initTable();
    const { ld_name, ld_quantity, ld_wt, kg_dzn, created_by } = ldData;
    const kgDznVal = parseFloat(kg_dzn) || (parseFloat(ld_wt) ? parseFloat(ld_wt) * 12 : 0);
    const unitWtVal = kgDznVal > 0 ? kgDznVal / 12 : (parseFloat(ld_wt) || 0);

    const query = 'INSERT INTO ld_inventory (ld_name, ld_quantity, ld_wt, kg_dzn, created_by) VALUES (?, ?, ?, ?, ?)';
    const [result] = await db.query(query, [ld_name, parseFloat(ld_quantity) || 0, unitWtVal, kgDznVal, created_by || null]);
    return { id: result.insertId, ld_name, ld_quantity, ld_wt: unitWtVal, kg_dzn: kgDznVal };
  },

  findAllLdNames: async () => {
    await LdInventory.initTable();
    const [rows] = await db.query('SELECT ld_name, ld_wt, ld_quantity, kg_dzn FROM ld_inventory');
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
    const { ld_name, ld_quantity, ld_wt, kg_dzn } = ldData;
    const kgDznVal = parseFloat(kg_dzn) || (parseFloat(ld_wt) ? parseFloat(ld_wt) * 12 : 0);
    const unitWtVal = kgDznVal > 0 ? kgDznVal / 12 : (parseFloat(ld_wt) || 0);

    const query = 'UPDATE ld_inventory SET ld_name = ?, ld_quantity = ?, ld_wt = ?, kg_dzn = ? WHERE id = ?';
    const [result] = await db.query(query, [ld_name, parseFloat(ld_quantity) || 0, unitWtVal, kgDznVal, id]);
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
