const db = require('../config/db');

const SalesOrder = {
  create: async (orderData) => {
    // Auto-set initial_qty to same value as quantity_pcs
    orderData.initial_qty = orderData.quantity_pcs || null;

    if (orderData.total_rs === undefined || orderData.total_rs === null || orderData.total_rs === '') {
      const isPerKg = Number(orderData.pic_or_kg) === 1;
      const qty = parseFloat(orderData.initial_qty || orderData.quantity_pcs) || 0;
      const ratePcs = parseFloat(orderData.rate_pcs) || 0;
      const totalKg = parseFloat(orderData.total_kg) || 0;
      const rateKz = parseFloat(orderData.rate_kz) || 0;
      orderData.total_rs = isPerKg
        ? Math.round(totalKg * rateKz * 100) / 100
        : Math.round(qty * ratePcs * 100) / 100;
    }

    const fields = [
      'order_number', 'order_date', 'customer_id', 'item_code', 'finish',
      'stock_qty', 'initial_qty', 'scrap', 'labour', 'kg_dzn', 'pcs_box', 'box_ctn',
      'pcs_ctn', 'kg_box', 'qty_ctn', 'total_kg', 'quantity_pcs',
      'order_stock', 'manufacturer_name', 'po_vr', 'note', 'invoice_status',
      'created_by', 'customer_code', 'customer_name', 'rate_pcs', 'rate_kz',
      'pic_or_kg', 'total_rs'
    ];
    const placeholders = fields.map(() => '?').join(', ');
    const values = fields.map(field => (orderData[field] !== undefined && orderData[field] !== null) ? orderData[field] : null);

    const query = `INSERT INTO sales_orders (${fields.join(', ')}) VALUES (${placeholders})`;
    const [result] = await db.query(query, values);
    return { id: result.insertId, ...orderData };
  },

  findAll: async () => {
    const query = `
      SELECT so.*, c.contact_name as customer_name,
        CASE
          WHEN so.initial_qty IS NULL THEN 'Uninvoiced'
          WHEN so.quantity_pcs = so.initial_qty THEN 'Uninvoiced'
          WHEN so.quantity_pcs > 0 AND so.quantity_pcs < so.initial_qty THEN 'Partial'
          WHEN so.quantity_pcs = 0 THEN 'Invoiced'
          ELSE 'Uninvoiced'
        END AS invoice_status
      FROM sales_orders so
      LEFT JOIN contacts c ON so.customer_id = c.id
      ORDER BY so.id DESC
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  findById: async (id) => {
    const query = `
      SELECT so.*, c.contact_name as customer_name,
        CASE
          WHEN so.initial_qty IS NULL THEN 'Uninvoiced'
          WHEN so.quantity_pcs = so.initial_qty THEN 'Uninvoiced'
          WHEN so.quantity_pcs > 0 AND so.quantity_pcs < so.initial_qty THEN 'Partial'
          WHEN so.quantity_pcs = 0 THEN 'Invoiced'
          ELSE 'Uninvoiced'
        END AS invoice_status
      FROM sales_orders so
      LEFT JOIN contacts c ON so.customer_id = c.id
      WHERE so.id = ?
    `;
    const [rows] = await db.query(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  update: async (id, orderData) => {
    // Protect initial_qty and invoice_status from manual edits
    delete orderData.initial_qty;
    delete orderData.invoice_status;

    // Filter out undefined keys so we never accidentally overwrite existing DB values with NULL
    const cleanData = {};
    for (const [key, val] of Object.entries(orderData)) {
      if (val !== undefined) {
        cleanData[key] = val;
      }
    }

    const fields = Object.keys(cleanData);
    if (fields.length === 0) {
      return 0; // Nothing to update
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = [...fields.map(field => cleanData[field]), id];

    const query = `UPDATE sales_orders SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    const [result] = await db.query(query, values);
    return result.affectedRows;
  },

  delete: async (id) => {
    const query = 'DELETE FROM sales_orders WHERE id = ?';
    const [result] = await db.query(query, [id]);
    return result.affectedRows;
  },
  searchByUserIds: async (userIds) => {
    const query = `
      SELECT so.*, c.contact_name as customer_name,
        CASE
          WHEN so.initial_qty IS NULL THEN 'Uninvoiced'
          WHEN so.quantity_pcs = so.initial_qty THEN 'Uninvoiced'
          WHEN so.quantity_pcs > 0 AND so.quantity_pcs < so.initial_qty THEN 'Partial'
          WHEN so.quantity_pcs = 0 THEN 'Invoiced'
          ELSE 'Uninvoiced'
        END AS invoice_status
      FROM sales_orders so 
      LEFT JOIN contacts c ON so.customer_id = c.id 
      WHERE so.created_by IN (?)
    `;
    const [rows] = await db.query(query, [userIds]);
    return rows;
  },

  getValidCodeUserList: async () => {
    const query = `
      SELECT DISTINCT CONCAT(i.item_code, i.user) as code_user, i.user, c.contact_name, c.code, i.item_code
      FROM inventory_items i
      INNER JOIN contacts c ON i.user = c.code
      WHERE c.type = 'Customer'
      AND i.code_user IS NOT NULL
      AND i.code_user != ''
      ORDER BY code_user ASC
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  getValidCodeUserListForSalesInvoices: async () => {
    const query = `
      SELECT DISTINCT CONCAT(i.item_code, i.user) as code_user, i.user, c.contact_name, c.code, i.item_code
      FROM inventory_items i
      INNER JOIN contacts c ON i.user = c.code
      INNER JOIN sales_orders so ON so.item_code = i.item_code
        AND (
          so.customer_code = i.user
          OR so.customer_id = i.user
        )
      WHERE c.type = 'Customer'
        AND i.code_user IS NOT NULL
        AND i.code_user != ''
        AND so.quantity_pcs > 0
      ORDER BY code_user ASC
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  getValidCodeUserListForSuppliers: async () => {
    const query = `
      SELECT DISTINCT CONCAT(i.item_code, i.user) as code_user, user, i.item_code
      FROM inventory_items i
      INNER JOIN contacts c ON i.user = c.code
      WHERE c.type = 'Supplier'
      AND i.code_user IS NOT NULL
      AND i.code_user != ''
      ORDER BY code_user ASC
    `;
    const [rows] = await db.query(query);
    return rows.map(row => ({ code_user: row.code_user, user: row.user, item_code: row.item_code }));
  },

  getInventoryByCodeUser: async (codeUser) => {
    const query = `
      SELECT
        i.finish,
        i.scrap,
        i.labour,
        i.kg_dzn,
        i.pcs_box,
        i.box_ctn,
        i.pcs_ctn,
        i.kg_box,
        i.rate_pcs,
        i.rate_adjustment,
        i.base_rate_pcs,
        i.pic_or_kg
      FROM inventory_items i
      WHERE i.code_user = ? OR i.code_user LIKE CONCAT(?, '_%')
      ORDER BY i.id DESC
      LIMIT 1
    `;
    const [rows] = await db.query(query, [codeUser, codeUser]);
    return rows[0] || null;
  },

  getSuppliersCodeAndName: async () => {
    const query = `SELECT code, contact_name FROM contacts WHERE type = 'Supplier' ORDER BY contact_name ASC`;
    const [rows] = await db.query(query);
    return rows.map(row => ({
      code: row.code.toString(),
      contact_name: row.contact_name.toString()
    }));
  },

  findStockByItemCode: async (itemCode) => {
    const query = 'SELECT stock_quantity FROM master_items WHERE item_code = ?';
    const [rows] = await db.query(query, [itemCode]);
    return rows[0];
  },

  // Paginated search with multi-term support
  findAllPaginated: async ({ page = 1, limit = 10, search = '' }) => {
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];

    // Multi-term search - split by space, must match ALL terms (AND logic)
    if (search && search.trim()) {
      const terms = search.trim().split(/\s+/).filter(t => t.length > 0);
      if (terms.length > 0) {
        const searchFields = [
          'so.order_number', 'so.customer_id', 'so.item_code', 'so.finish',
          'so.manufacturer_name', 'so.po_vr', 'so.note', 'so.customer_code',
          'so.customer_name', 'c.contact_name',
          "DATE_FORMAT(so.order_date, '%d-%m-%Y')",
          "DATE_FORMAT(so.order_date, '%d-%m-%y')",
          "DATE_FORMAT(so.order_date, '%d/%m/%Y')",
          "DATE_FORMAT(so.order_date, '%d/%m/%y')",
          "DATE_FORMAT(so.order_date, '%Y-%m-%d')",
          "DATE_FORMAT(so.order_date, '%d-%m')",
          "DATE_FORMAT(so.order_date, '%d/%m')",
          "CAST(so.order_date AS CHAR)",
          "CAST(so.rate_pcs AS CHAR)",
          "CAST(so.rate_kz AS CHAR)",
          "CAST(so.quantity_pcs AS CHAR)",
          "CAST(so.total_kg AS CHAR)",
          "CAST(so.qty_ctn AS CHAR)",
          "CAST(so.total_rs AS CHAR)",
          "CAST(ROUND(so.quantity_pcs * so.rate_pcs, 2) AS CHAR)",
          "CAST(ROUND(so.total_kg * so.rate_kz, 2) AS CHAR)"
        ];

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

    // Count query
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM sales_orders so
      LEFT JOIN contacts c ON so.customer_id = c.id
      ${whereClause}
    `;
    const [countResult] = await db.query(countQuery, queryParams);
    const total = countResult[0].total;

    // Data query
    const dataQuery = `
      SELECT so.*, c.contact_name as customer_name,
        CASE
          WHEN so.initial_qty IS NULL THEN 'Uninvoiced'
          WHEN so.quantity_pcs = so.initial_qty THEN 'Uninvoiced'
          WHEN so.quantity_pcs > 0 AND so.quantity_pcs < so.initial_qty THEN 'Partial'
          WHEN so.quantity_pcs = 0 THEN 'Invoiced'
          ELSE 'Uninvoiced'
        END AS invoice_status
      FROM sales_orders so
      LEFT JOIN contacts c ON so.customer_id = c.id
      ${whereClause}
      ORDER BY so.id DESC
      LIMIT ? OFFSET ?
    `;
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
};

module.exports = SalesOrder;