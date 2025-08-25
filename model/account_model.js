const db = require('../config/db');
const Account = {
  create: async (accountData) => {
    const { account_name, balance, code, created_by } = accountData;
    const query = 'INSERT INTO accounts (account_name, balance, code, created_by) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(query, [account_name, balance || 0.00, code, created_by]);
    return { id: result.insertId, ...accountData };
  },
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM accounts');
    return rows;
  }
};
module.exports = Account;