const db = require('../config/db');
const MasterItem = {
  create: async (itemData) => {
    const { item_code, description, kg_dz, created_by } = itemData;
    const query = 'INSERT INTO master_items (item_code, description, kg_dz, created_by) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(query, [item_code, description, kg_dz, created_by]);
    return { id: result.insertId, ...itemData };
  },

  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM master_items');
    return rows;
  },

  findAllCorton: async () => {
    const [rows] = await db.query('SELECT * FROM carton_inventory');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM master_items WHERE id = ?', [id]);
    return rows[0];
  },

  update: async (id, itemData) => {
    const { item_code, description, kg_dz } = itemData;
    const query = 'UPDATE master_items SET item_code = ?, description = ?, kg_dz = ? WHERE id = ?';
    const [result] = await db.query(query, [item_code, description, kg_dz, id]);
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM master_items WHERE id = ?', [id]);
    return result.affectedRows;
  },
  findAllItemCodes: async () => {
    const [rows] = await db.query('SELECT item_code FROM master_items');
    return rows.map(row => row.item_code);
},

};
module.exports = MasterItem;