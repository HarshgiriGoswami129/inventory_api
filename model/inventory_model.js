const db = require('../config/db');
const InventoryItem = {
  create: async (itemData) => {
    const columns = Object.keys(itemData);
    const values = Object.values(itemData);
    const placeholders = columns.map(() => '?').join(', ');
    const query = `INSERT INTO inventory_items (${columns.join(', ')}) VALUES (${placeholders})`;
    const [result] = await db.query(query, values);
    return { id: result.insertId, ...itemData };
  },

  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM inventory_items');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM inventory_items WHERE id = ?', [id]);
    return rows[0];
  },

  update: async (id, itemData) => {
    const updates = Object.keys(itemData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(itemData), id];
    const query = `UPDATE inventory_items SET ${updates} WHERE id = ?`;
    const [result] = await db.query(query, values);
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM inventory_items WHERE id = ?', [id]);
    return result.affectedRows;
  },
  searchByItemCode: async (itemCode) => {
  const query = `SELECT * FROM inventory_items WHERE item_code LIKE ? ORDER BY id DESC`;
  const [rows] = await db.query(query, [`%${itemCode}%`]);
  return rows;
},
findAllItemCodes: async () => {
    const [rows] = await db.query('SELECT DISTINCT item_code FROM inventory_items ORDER BY item_code');
    return rows;
},
searchByExactItemCode: async (itemCode) => {
  const query = `SELECT description, kg_dz FROM master_items WHERE item_code = ? LIMIT 1`;
  const rows = await db.query(query, [itemCode]);
  return rows[0] || null;
},

};
module.exports = InventoryItem;