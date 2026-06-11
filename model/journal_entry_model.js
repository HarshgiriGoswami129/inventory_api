const db = require('../config/db');

const JournalEntryModel = {
  // Create new journal entry
  create: async (entryData) => {
    const { entry_type_id, date, type, customer_name, method_id, amount, notes, note_1, note_2, note_3, note_4, attachment, user_id } = entryData;
    const query = `
      INSERT INTO journal_entries (entry_type_id, date, type, customer_name, method_id, amount, notes, note_1, note_2, note_3, note_4, attachment, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      entry_type_id,
      date,
      type,
      customer_name,
      method_id,
      amount,
      notes || null,
      note_1 || null,
      note_2 || null,
      note_3 || null,
      note_4 || null,
      attachment || null,
      user_id
    ]);
    return await JournalEntryModel.getById(result.insertId);
  },

  // Get all journal entries with optional filters + running_balance per row
  getAll: async (filters = {}) => {
    // Inner query: calculate running_balance for ALL entries in this ledger type
    // so that balance is always correct even when other filters are applied.
    const innerParams = [filters.entry_type_id];

    // Outer filters (search, type, date) applied AFTER running_balance is computed
    let outerWhere = 'WHERE 1=1';
    const outerParams = [];

    if (filters.search) {
      outerWhere += ' AND (sub.customer_name LIKE ? OR sub.method_name LIKE ? OR sub.notes LIKE ? OR sub.note_1 LIKE ? OR sub.note_3 LIKE ? OR sub.note_4 LIKE ?)';
      const s = `%${filters.search}%`;
      outerParams.push(s, s, s, s, s, s);
    }
    if (filters.type) {
      outerWhere += ' AND sub.type = ?';
      outerParams.push(filters.type);
    }
    if (filters.startDate) {
      outerWhere += ' AND sub.date >= ?';
      outerParams.push(filters.startDate);
    }
    if (filters.endDate) {
      outerWhere += ' AND sub.date <= ?';
      outerParams.push(filters.endDate);
    }

    let limitSuffix = '';
    const limitParams = [];
    if (filters.limit) {
      limitSuffix = ' LIMIT ?';
      limitParams.push(filters.limit);
    }

    const query = `
      SELECT * FROM (
        SELECT
          je.*,
          pm.name  AS method_name,
          jet.name AS entry_type_name,
          SUM(CASE WHEN je.type = 'Receipt' THEN je.amount ELSE -je.amount END)
            OVER (
              PARTITION BY je.entry_type_id
              ORDER BY je.date ASC, je.id ASC
              ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
            ) AS running_balance
        FROM journal_entries je
        LEFT JOIN payment_methods pm  ON je.method_id    = pm.id
        LEFT JOIN journal_entry_types jet ON je.entry_type_id = jet.id
        WHERE je.entry_type_id = ?
      ) sub
      ${outerWhere}
      ORDER BY sub.date DESC, sub.created_at DESC
      ${limitSuffix}
    `;

    const [rows] = await db.query(query, [...innerParams, ...outerParams, ...limitParams]);
    return rows;
  },

  // Get journal entry by ID
  getById: async (id) => {
    const query = `
      SELECT 
        je.*,
        pm.name as method_name,
        jet.name as entry_type_name
      FROM journal_entries je
      LEFT JOIN payment_methods pm ON je.method_id = pm.id
      LEFT JOIN journal_entry_types jet ON je.entry_type_id = jet.id
      WHERE je.id = ?
    `;
    const [rows] = await db.query(query, [id]);
    return rows[0] || null;
  },

  // Update journal entry
  update: async (id, entryData) => {
    const { entry_type_id, date, type, customer_name, method_id, amount, notes, note_1, note_2, note_3, note_4, attachment } = entryData;
    const updateKeys = [];
    const updateValues = [];

    if (entry_type_id !== undefined) {
      updateKeys.push('entry_type_id = ?');
      updateValues.push(entry_type_id);
    }
    if (date !== undefined) {
      updateKeys.push('date = ?');
      updateValues.push(date);
    }
    if (type !== undefined) {
      updateKeys.push('type = ?');
      updateValues.push(type);
    }
    if (customer_name !== undefined) {
      updateKeys.push('customer_name = ?');
      updateValues.push(customer_name);
    }
    if (method_id !== undefined) {
      updateKeys.push('method_id = ?');
      updateValues.push(method_id);
    }
    if (amount !== undefined) {
      updateKeys.push('amount = ?');
      updateValues.push(amount);
    }
    if (notes !== undefined) {
      updateKeys.push('notes = ?');
      updateValues.push(notes || null);
    }
    if (note_1 !== undefined) {
      updateKeys.push('note_1 = ?');
      updateValues.push(note_1 || null);
    }
    if (note_2 !== undefined) {
      updateKeys.push('note_2 = ?');
      updateValues.push(note_2 || null);
    }
    if (note_3 !== undefined) {
      updateKeys.push('note_3 = ?');
      updateValues.push(note_3 || null);
    }
    if (note_4 !== undefined) {
      updateKeys.push('note_4 = ?');
      updateValues.push(note_4 || null);
    }
    if (attachment !== undefined) {
      updateKeys.push('attachment = ?');
      updateValues.push(attachment || null);
    }

    if (updateKeys.length === 0) {
      return await JournalEntryModel.getById(id);
    }

    updateValues.push(id);
    const query = `UPDATE journal_entries SET ${updateKeys.join(', ')} WHERE id = ?`;
    const [result] = await db.query(query, updateValues);

    if (result.affectedRows === 0) {
      return null;
    }

    return await JournalEntryModel.getById(id);
  },

  // Delete journal entry
  delete: async (id) => {
    const query = 'DELETE FROM journal_entries WHERE id = ?';
    const [result] = await db.query(query, [id]);
    return result.affectedRows > 0;
  },

  // Get metrics (Total Receipts, Total Payments from note_2, Remaining Balance)
  getMetrics: async (filters = {}) => {
    let query = `
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'Receipt' THEN amount ELSE 0 END), 0) as total_receipts,
        COALESCE(SUM(CASE WHEN type = 'Payment' THEN amount ELSE 0 END), 0) as total_payments
      FROM journal_entries
      WHERE 1=1
    `;
    const params = [];

    // Filter by entry type (REQUIRED for user access control)
    if (filters.entry_type_id) {
      query += ' AND entry_type_id = ?';
      params.push(filters.entry_type_id);
    }

    if (filters.search) {
      query += ' AND (customer_name LIKE ? OR notes LIKE ? OR note_1 LIKE ? OR note_2 LIKE ? OR note_3 LIKE ? OR note_4 LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (filters.startDate) {
      query += ' AND date >= ?';
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ' AND date <= ?';
      params.push(filters.endDate);
    }

    const [rows] = await db.query(query, params);
    const metrics = rows[0] || { total_receipts: 0, total_payments: 0 };

    const totalReceipts = parseFloat(metrics.total_receipts) || 0;
    const totalPayments = parseFloat(metrics.total_payments) || 0;
    const remainingBalance = totalReceipts - totalPayments;

    return {
      total_receipts: totalReceipts,
      total_payments: totalPayments,
      remaining_balance: remainingBalance
    };
  }
};

module.exports = JournalEntryModel;


