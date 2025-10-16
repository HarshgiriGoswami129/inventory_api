const db = require('../config/db');

const PatiTable = {

  create: async (patiData) => {
    const { pati_type, created_by } = patiData;
    const query = 'INSERT INTO pati_table (pati_type, created_by) VALUES (?, ?)';
    const [result] = await db.query(query, [pati_type, created_by]);
    return { id: result.insertId, ...patiData };
  },

  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM pati_table');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM pati_table WHERE id = ?', [id]);
    return rows[0];
  },

  update: async (id, patiData) => {
    const { pati_type } = patiData;
    const query = 'UPDATE pati_table SET pati_type = ? WHERE id = ?';
    const [result] = await db.query(query, [pati_type, id]);
    return result.affectedRows;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM pati_table WHERE id = ?', [id]);
    return result.affectedRows;
  },

  findAllPatiTypes: async () => {
    const [rows] = await db.query('SELECT pati_type FROM pati_table');
    return rows.map(row => row.pati_type);
  },

};

module.exports = PatiTable;
