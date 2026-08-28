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
          shrink_wt DECIMAL(10,6) DEFAULT 0,
          kg_dzn DECIMAL(10,4) DEFAULT 0,
          created_by INT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `;
      await db.query(createQuery);
      // Ensure kg_dzn column exists if table already existed
      try {
        await db.query('ALTER TABLE shrink_inventory ADD COLUMN kg_dzn DECIMAL(10,4) DEFAULT 0');
      } catch (e) {
        // Ignore column exists error
      }
    } catch (err) {
      console.error('Error initializing shrink_inventory table:', err);
    }
  },

  create: async (shrinkData) => {
    await ShrinkInventory.initTable();
    const { shrink_name, shrink_quantity, shrink_wt, kg_dzn, created_by } = shrinkData;
    const kgDznVal = parseFloat(kg_dzn) || (parseFloat(shrink_wt) ? parseFloat(shrink_wt) * 12 : 0);
    const unitWtVal = kgDznVal > 0 ? kgDznVal / 12 : (parseFloat(shrink_wt) || 0);

    const query = 'INSERT INTO shrink_inventory (shrink_name, shrink_quantity, shrink_wt, kg_dzn, created_by) VALUES (?, ?, ?, ?, ?)';
    const [result] = await db.query(query, [shrink_name, parseFloat(shrink_quantity) || 0, unitWtVal, kgDznVal, created_by || null]);
    return { id: result.insertId, shrink_name, shrink_quantity, shrink_wt: unitWtVal, kg_dzn: kgDznVal };
  },

  findAllShrinkNames: async () => {
    await ShrinkInventory.initTable();
    const [rows] = await db.query('SELECT shrink_name, shrink_wt, shrink_quantity, kg_dzn FROM shrink_inventory');
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
    const { shrink_name, shrink_quantity, shrink_wt, kg_dzn } = shrinkData;
    const kgDznVal = parseFloat(kg_dzn) || (parseFloat(shrink_wt) ? parseFloat(shrink_wt) * 12 : 0);
    const unitWtVal = kgDznVal > 0 ? kgDznVal / 12 : (parseFloat(shrink_wt) || 0);

    const query = 'UPDATE shrink_inventory SET shrink_name = ?, shrink_quantity = ?, shrink_wt = ?, kg_dzn = ? WHERE id = ?';
    const [result] = await db.query(query, [shrink_name, parseFloat(shrink_quantity) || 0, unitWtVal, kgDznVal, id]);
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
