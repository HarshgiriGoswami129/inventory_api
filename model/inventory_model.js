const db = require('../config/db');

const InventoryItem = {
  initColumns: async () => {
    try {
      await db.query('ALTER TABLE inventory_items ADD COLUMN box_name VARCHAR(255) NULL');
    } catch (e) {
      // Column already exists
    }
    try {
      await db.query('ALTER TABLE inventory_items ADD COLUMN shrink_name VARCHAR(255) NULL');
    } catch (e) {
      // Column already exists
    }
    try {
      await db.query('ALTER TABLE inventory_items ADD COLUMN ld_name VARCHAR(255) NULL');
    } catch (e) {
      // Column already exists
    }
  },

  create: async (itemData) => {
    await InventoryItem.initColumns();
    const cleanData = { ...itemData };
    delete cleanData.id;
    delete cleanData.originalId;
    delete cleanData.rate_adjustment_display;
    delete cleanData.order_per_pics_kg;

    const columns = Object.keys(cleanData);
    const values = Object.values(cleanData);
    const placeholders = columns.map(() => '?').join(', ');
    const query = `INSERT INTO inventory_items (${columns.join(', ')}) VALUES (${placeholders})`;
    const [result] = await db.query(query, values);
    return { id: result.insertId, ...cleanData };
  },

  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM inventory_items');
    return rows;
  },

  // Paginated search with multi-term support
  findAllPaginated: async ({ page = 1, limit = 10, search = '' }) => {
    await InventoryItem.initColumns();
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];

    if (search && search.trim()) {
      const terms = search.trim().split(/\s+/).filter(t => t.length > 0);
      if (terms.length > 0) {
        const searchFields = ['item_code', 'code_user', 'user', 'description', 'finish'];

        const termConditions = terms.map(term => {
          const fieldConditions = searchFields.map(field => {
            queryParams.push(`%${term}%`);
            return `${field} LIKE ?`;
          }).join(' OR ');
          return `(${fieldConditions})`;
        });

        whereConditions.push(`(${termConditions.join(' AND ')})`);
      }
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) as total FROM inventory_items ${whereClause}`;
    const [countResult] = await db.query(countQuery, queryParams);
    const total = countResult[0].total;

    const dataQuery = `SELECT * FROM inventory_items ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`;
    const [rows] = await db.query(dataQuery, [...queryParams, limit, offset]);

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM inventory_items WHERE id = ?', [id]);
    return rows[0];
  },

  update: async (id, itemData) => {
    await InventoryItem.initColumns();
    const cleanData = { ...itemData };
    delete cleanData.id;
    delete cleanData.originalId;
    delete cleanData.rate_adjustment_display;
    delete cleanData.order_per_pics_kg;

    const keys = Object.keys(cleanData);
    if (keys.length === 0) return 0;

    const updates = keys.map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(cleanData), id];
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