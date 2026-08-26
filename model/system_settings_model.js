const db = require('../config/db');

const SystemSettings = {
  // Ensure the settings table exists
  initTable: async () => {
    try {
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS system_settings (
          setting_key VARCHAR(100) PRIMARY KEY,
          setting_value LONGTEXT,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `;
      await db.query(createTableQuery);
    } catch (err) {
      console.error('Error initializing system_settings table:', err);
    }
  },

  // Get setting by key
  getSetting: async (key) => {
    await SystemSettings.initTable();
    const query = 'SELECT setting_value FROM system_settings WHERE setting_key = ?';
    const [rows] = await db.query(query, [key]);
    if (rows.length > 0) {
      try {
        return JSON.parse(rows[0].setting_value);
      } catch (e) {
        return rows[0].setting_value;
      }
    }
    return null;
  },

  // Save setting by key
  saveSetting: async (key, value) => {
    await SystemSettings.initTable();
    const stringVal = typeof value === 'object' ? JSON.stringify(value) : String(value);
    const query = `
      INSERT INTO system_settings (setting_key, setting_value)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE setting_value = ?
    `;
    await db.query(query, [key, stringVal, stringVal]);
    return true;
  }
};

module.exports = SystemSettings;
