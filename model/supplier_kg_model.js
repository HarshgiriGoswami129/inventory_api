const db = require('../config/db');
const { recalculateSupplierKGBalances } = require('../utils/supplier_balance_helper');

const SupplierKGDeduction = {
  create: async (data) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { contact_id, date, net_kg, notes } = data;
      const numKg = parseFloat(net_kg) || 0;

      if (!contact_id) {
        throw new Error('Supplier (contact_id) is required');
      }
      if (numKg <= 0) {
        throw new Error('Net KG must be greater than 0');
      }

      // 1. Get supplier material_type
      const [suppRows] = await connection.query(
        'SELECT material_type FROM supplier_details WHERE contact_id = ? LIMIT 1',
        [contact_id]
      );
      const materialType = suppRows[0]?.material_type || data.material_type || 'SC';

      // 2. Insert deduction
      const insertQuery = `
        INSERT INTO supplier_kg_deductions (contact_id, date, net_kg, material_type, notes)
        VALUES (?, ?, ?, ?, ?)
      `;
      const [insertResult] = await connection.query(insertQuery, [
        contact_id,
        date || new Date().toISOString().split('T')[0],
        numKg,
        materialType,
        notes || null
      ]);

      // 3. Centralized FIFO recalculation of Net KG balances
      const balanceResult = await recalculateSupplierKGBalances(contact_id, connection);

      await connection.commit();

      return {
        id: insertResult.insertId,
        contact_id,
        date,
        net_kg: numKg,
        material_type: materialType,
        notes,
        balanceResult
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  getAll: async (options = {}) => {
    const { contact_id, page = 1, limit = 100, search = '' } = options;
    const offset = (page - 1) * limit;

    let whereClause = '1=1';
    const params = [];

    if (contact_id) {
      whereClause += ' AND d.contact_id = ?';
      params.push(contact_id);
    }

    if (search && search.trim()) {
      whereClause += ' AND (c.contact_name LIKE ? OR c.code LIKE ? OR d.notes LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s, s);
    }

    const countQuery = `
      SELECT COUNT(*) as total 
      FROM supplier_kg_deductions d
      LEFT JOIN contacts c ON c.id = d.contact_id
      WHERE ${whereClause}
    `;
    const [countRows] = await db.query(countQuery, params);
    const total = countRows[0]?.total || 0;

    const dataQuery = `
      SELECT 
        d.*,
        c.contact_name,
        c.code AS supplier_code
      FROM supplier_kg_deductions d
      LEFT JOIN contacts c ON c.id = d.contact_id
      WHERE ${whereClause}
      ORDER BY d.date DESC, d.id DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await db.query(dataQuery, [...params, parseInt(limit, 10), parseInt(offset, 10)]);

    return {
      data: rows,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / limit)
    };
  },

  getById: async (id) => {
    const query = `
      SELECT 
        d.*,
        c.contact_name,
        c.code AS supplier_code
      FROM supplier_kg_deductions d
      LEFT JOIN contacts c ON c.id = d.contact_id
      WHERE d.id = ?
    `;
    const [rows] = await db.query(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  delete: async (id) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [dedRows] = await connection.query(
        'SELECT contact_id FROM supplier_kg_deductions WHERE id = ? LIMIT 1',
        [id]
      );
      if (dedRows.length === 0) {
        throw new Error('Deduction not found');
      }
      const contactId = dedRows[0].contact_id;

      await connection.query('DELETE FROM supplier_kg_deductions WHERE id = ?', [id]);

      // Recalculate balances after deletion
      await recalculateSupplierKGBalances(contactId, connection);

      await connection.commit();
      return { success: true, id, contactId };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
};

module.exports = SupplierKGDeduction;
