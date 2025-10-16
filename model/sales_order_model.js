const db = require('../config/db');

const SalesOrder = {
  create: async (orderData) => {
    const fields = [
      'order_number', 'order_date', 'customer_id', 'item_code', 'finish', 
      'stock_qty', 'scrap', 'labour', 'kg_dzn', 'pcs_box', 'box_ctn', 
      'pcs_ctn', 'kg_box', 'qty_ctn', 'total_kg', 'quantity_pcs', 
      'order_stock', 'manufacturer_name', 'po_vr', 'note', 'invoice_status', 
      'created_by', 'customer_code', 'customer_name', 'rate_pcs', 'rate_kz'
    ];
    const placeholders = fields.map(() => '?').join(', ');
    const values = fields.map(field => orderData[field] || null);

    const query = `INSERT INTO sales_orders (${fields.join(', ')}) VALUES (${placeholders})`;
    const [result] = await db.query(query, values);
    return { id: result.insertId, ...orderData };
  },

  findAll: async () => {
    const query = `
      SELECT so.*, c.contact_name as customer_name 
      FROM sales_orders so
      LEFT JOIN contacts c ON so.customer_id = c.id
      ORDER BY so.id DESC
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  update: async (id, orderData) => {
    const fields = Object.keys(orderData);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = [...fields.map(field => orderData[field]), id];

    if (fields.length === 0) {
      return 0; // Nothing to update
    }

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
      SELECT so.*, c.contact_name as customer_name 
      FROM sales_orders so 
      LEFT JOIN contacts c ON so.customer_id = c.id 
      WHERE so.created_by IN (?)
    `;
    const [rows] = await db.query(query, [userIds]);
    return rows;
  },

  getValidCodeUserList: async () => {
    const query = `
      SELECT DISTINCT i.code_user, i.user, c.contact_name, c.code, i.item_code
      FROM inventory_items i
      INNER JOIN contacts c ON i.user = c.code
      WHERE c.type = 'Customer'
      AND i.code_user IS NOT NULL
      AND i.code_user != ''
      ORDER BY i.code_user ASC
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  getValidCodeUserListForSuppliers: async () => {
    const query = `
      SELECT DISTINCT i.code_user, user,i.item_code
      FROM inventory_items i
      INNER JOIN contacts c ON i.user = c.code
      WHERE c.type = 'Supplier'
      AND i.code_user IS NOT NULL
      AND i.code_user != ''
      ORDER BY i.code_user ASC
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
        i.kg_box
      FROM inventory_items i
      WHERE i.code_user = ?
      LIMIT 1
    `;
    const [rows] = await db.query(query, [codeUser]);
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
};

module.exports = SalesOrder;