const db = require('../config/db');

const SalesInvoice = {
  create: async (data) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Prepare invoice insert
      const {
        customer, invoice_no, invoice_date, due_date, status, no1, no2,
        sr_no, item_code, item_description_size, item_finish, pcs_per_box,
        extra_pcs, total_pcs, total_weight, scrap_lb, total_rs, brass, lb,
        kg_per_box, pcs_rate, box_wt, tmp_wt, net_kg, ctn_no, ctn_wt,
        weight_per_ctn, gst, total, grand_total
      } = data;

      const insertQuery = `
        INSERT INTO sales_invoice
        (customer, invoice_no, invoice_date, due_date, status, no1, no2,
         sr_no, item_code, item_description_size, item_finish, pcs_per_box,
         extra_pcs, total_pcs, total_weight, scrap_lb, total_rs, brass, lb,
         kg_per_box, pcs_rate, box_wt, tmp_wt, net_kg, ctn_no, ctn_wt,
         weight_per_ctn, gst, total, grand_total)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        customer, invoice_no, invoice_date, due_date, status, no1, no2,
        sr_no, item_code, item_description_size, item_finish, pcs_per_box,
        extra_pcs, total_pcs, total_weight, scrap_lb, total_rs, brass, lb,
        kg_per_box, pcs_rate, box_wt, tmp_wt, net_kg, ctn_no, ctn_wt,
        weight_per_ctn, gst, total, grand_total
      ];

      const [result] = await connection.query(insertQuery, values);

      // Update quantity_pcs in sales_orders
      if (item_code && item_finish && total_pcs && total_pcs > 0) {
        const updateQtyQuery = `
          UPDATE sales_orders
          SET quantity_pcs = GREATEST(quantity_pcs - ?, 0)
          WHERE item_code = ?
          AND finish = ?
          AND quantity_pcs > 0
        `;
        await connection.query(updateQtyQuery, [total_pcs, item_code, item_finish]);

        // Additionally update invoice_status to 'pedding'
        const updateStatusQuery = `
          UPDATE sales_orders
          SET invoice_status = 'pedding'
          WHERE item_code = ?
          AND finish = ?
        `;
        await connection.query(updateStatusQuery, [item_code, item_finish]);
      }

      await connection.commit();
      connection.release();
      return { id: result.insertId, ...data };

    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  },

  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM sales_invoice ORDER BY id DESC');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM sales_invoice WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  update: async (id, data) => {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(data)) {
      if (key !== 'id' && value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    values.push(id);
    const query = `UPDATE sales_invoice SET ${fields.join(', ')} WHERE id = ?`;
    await db.query(query, values);

    const [rows] = await db.query('SELECT * FROM sales_invoice WHERE id = ?', [id]);
    return rows;
  },

  delete: async (id) => {
    await db.query('DELETE FROM sales_invoice WHERE id = ?', [id]);
  },
  getDistinctCustomerNames: async () => {
    const query = `
    SELECT DISTINCT customer_name 
    FROM sales_orders 
    WHERE customer_name IS NOT NULL AND customer_name != '' 
    ORDER BY customer_name ASC
  `;
    const [rows] = await db.query(query);
    return rows.map(row => row.customer_name);
  },

  findFinishNoteByCustomerName: async (customerName) => {
    const query = `
    SELECT finish, note
    FROM sales_orders
    WHERE customer_name = ?
  `;
    const [rows] = await db.query(query, [customerName]);
    return rows;
  },

  findUnfinishedFinishesByCustomerId: async (customerId, code_user) => {
    // Query 1: Get all unfinished sales orders for the customer (this is your original query)
    const salesOrderQuery = `
    SELECT DISTINCT
      finish, 
      kg_box, 
      scrap,
      labour,
      pcs_box,
      note,
      rate_pcs
    FROM sales_orders 
    WHERE customer_id = ? AND (invoice_status IS NULL OR invoice_status != 'completed')
  `;

    const [salesOrders] = await db.query(salesOrderQuery, [customerId]);

    // If we didn't find any sales orders, we can stop here.
    if (salesOrders.length === 0) {
      return [];
    }

    const searchCode = code_user || customerId || "";
    const cleanItemCode = searchCode.replace(/[^A-Za-z0-9]/g, "").substring(0, 7);
    const userCode = searchCode.length > 7 ? searchCode.substring(7) : "";

    // Query 2: Get description, pic_or_kg, kg_dzn, empty_wt, actual_wt, box_name, shrink_name, ld_name, rate_adjustment from inventory_items
    // Prioritize exact customer/user matches over other customers' records
    const descriptionQuery = `
      SELECT description, pic_or_kg, kg_dzn, empty_wt, actual_wt, box_name, shrink_name, ld_name, rate_adjustment, rate_pcs 
      FROM inventory_items 
      WHERE code_user = ? 
         OR code_user LIKE CONCAT(?, '_%') 
         OR (item_code = ? AND user = ?)
         OR CONCAT(item_code, user) = ? 
         OR code_user LIKE CONCAT(?, '%')
         OR item_code = ?
      ORDER BY 
        CASE 
          WHEN code_user = ? THEN 1
          WHEN code_user LIKE CONCAT(?, '_%') THEN 2
          WHEN item_code = ? AND user = ? THEN 3
          WHEN CONCAT(item_code, user) = ? THEN 4
          WHEN item_code = ? THEN 5
          ELSE 6
        END ASC,
        id DESC
      LIMIT 1
    `;

    const [inventoryRows] = await db.query(descriptionQuery, [
      searchCode,
      searchCode,
      cleanItemCode, userCode,
      searchCode,
      searchCode,
      cleanItemCode,
      searchCode,
      searchCode,
      cleanItemCode, userCode,
      searchCode,
      cleanItemCode
    ]);

    // Get the description and weights from the result, or set to null if not found.
    const defaultRow = inventoryRows.length > 0 ? inventoryRows[0] : {};
    const description = defaultRow.description || null;
    const picKg = defaultRow.pic_or_kg !== undefined ? defaultRow.pic_or_kg : null;
    const kg_dzn = defaultRow.kg_dzn || null;
    const empty_wt = defaultRow.empty_wt || null;
    const actual_wt = defaultRow.actual_wt || null;
    const box_name = defaultRow.box_name || null;
    const shrink_name = defaultRow.shrink_name || null;
    const ld_name = defaultRow.ld_name || null;
    const rate_adjustment = defaultRow.rate_adjustment || null;

    // Add the inventory details to every sales order object
    const finalResult = await Promise.all(salesOrders.map(async (order) => {
      let orderBoxName = box_name;
      let orderShrinkName = shrink_name;
      let orderLdName = ld_name;
      let orderDesc = description;
      let orderPicKg = picKg;
      let orderKgDzn = kg_dzn;
      let orderEmptyWt = empty_wt;
      let orderActualWt = actual_wt;
      let orderRateAdjustment = rate_adjustment;
      let orderRatePcs = order.rate_pcs || defaultRow.rate_pcs || null;

      if (order.finish) {
        const cleanFinish = String(order.finish).trim().replace(/\s+/g, '');
        const specificCodeUser = `${searchCode}_${cleanFinish}`;
        const [specificRows] = await db.query(
          `SELECT description, pic_or_kg, kg_dzn, empty_wt, actual_wt, box_name, shrink_name, ld_name, rate_adjustment, rate_pcs 
           FROM inventory_items 
           WHERE code_user = ? 
              OR code_user LIKE CONCAT(?, '_%') 
              OR (item_code = ? AND user = ? AND finish = ?)
              OR (item_code = ? AND user = ? AND finish LIKE CONCAT('%', ?, '%'))
              OR (item_code = ? AND finish = ?)
              OR (item_code = ? AND finish LIKE CONCAT('%', ?, '%'))
           ORDER BY 
             CASE 
               WHEN code_user = ? THEN 1
               WHEN code_user LIKE CONCAT(?, '_%') THEN 2
               WHEN item_code = ? AND user = ? AND finish = ? THEN 3
               WHEN item_code = ? AND user = ? AND finish LIKE CONCAT('%', ?, '%') THEN 4
               WHEN item_code = ? AND finish = ? THEN 5
               ELSE 6
             END ASC,
             id DESC
           LIMIT 1`,
          [
            specificCodeUser,
            specificCodeUser,
            cleanItemCode, userCode, order.finish,
            cleanItemCode, userCode, order.finish,
            cleanItemCode, order.finish,
            cleanItemCode, order.finish,
            specificCodeUser,
            specificCodeUser,
            cleanItemCode, userCode, order.finish,
            cleanItemCode, userCode, order.finish,
            cleanItemCode, order.finish
          ]
        );
        if (specificRows.length > 0) {
          const sRow = specificRows[0];
          if (sRow.box_name) orderBoxName = sRow.box_name;
          if (sRow.shrink_name) orderShrinkName = sRow.shrink_name;
          if (sRow.ld_name) orderLdName = sRow.ld_name;
          if (sRow.description) orderDesc = sRow.description;
          if (sRow.pic_or_kg !== null && sRow.pic_or_kg !== undefined) orderPicKg = sRow.pic_or_kg;
          if (sRow.kg_dzn !== null && sRow.kg_dzn !== undefined) orderKgDzn = sRow.kg_dzn;
          if (sRow.empty_wt !== null && sRow.empty_wt !== undefined) orderEmptyWt = sRow.empty_wt;
          if (sRow.actual_wt !== null && sRow.actual_wt !== undefined) orderActualWt = sRow.actual_wt;
          if (sRow.rate_adjustment) orderRateAdjustment = sRow.rate_adjustment;
          if (!orderRatePcs && sRow.rate_pcs) orderRatePcs = sRow.rate_pcs;
        }
      }

      return {
        ...order,
        rate_pcs: orderRatePcs,
        description: orderDesc,
        pic_or_kg: orderPicKg,
        kg_dzn: orderKgDzn,
        empty_wt: orderEmptyWt,
        actual_wt: orderActualWt,
        box_name: orderBoxName,
        shrink_name: orderShrinkName,
        ld_name: orderLdName,
        rate_adjustment: orderRateAdjustment
      };
    }));

    return finalResult;
  },
  findByInvoiceNo: async (invoiceNo) => {
    const query = 'SELECT * FROM sales_invoice WHERE invoice_no = ?';
    const [rows] = await db.query(query, [invoiceNo]);
    return rows;
  },
  createBatch: async (invoices) => {
    // LOG 4
    console.log('--- MODEL: createBatch function STARTED. ---');
    const connection = await db.getConnection();
    const createdInvoices = [];

    try {
      await connection.beginTransaction();
      // LOG 5
      console.log('--- MODEL: Database transaction BEGAN. ---');

      for (const invoiceData of invoices) {
        const {
          customer, invoice_no, invoice_date, due_date, status, no1, no2,
          sr_no, item_code, item_description_size, item_finish, pcs_per_box,
          extra_pcs, total_pcs, total_weight, scrap_lb, total_rs, brass, lb,
          kg_per_box, pcs_rate, box_wt, tmp_wt, net_kg, ctn_no, ctn_wt,
          weight_per_ctn, gst, total, grand_total
        } = invoiceData;

        // 1. INSERT into sales_invoice
        const insertQuery = `
          INSERT INTO sales_invoice
          (customer, invoice_no, invoice_date, due_date, status, no1, no2,
           sr_no, item_code, item_description_size, item_finish, pcs_per_box,
           extra_pcs, total_pcs, total_weight, scrap_lb, total_rs, brass, lb,
           kg_per_box, pcs_rate, box_wt, tmp_wt, net_kg, ctn_no, ctn_wt,
           weight_per_ctn, gst, total, grand_total)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
          customer, invoice_no, invoice_date, due_date, status, no1, no2,
          sr_no, item_code, item_description_size, item_finish, pcs_per_box,
          extra_pcs, total_pcs, total_weight, scrap_lb, total_rs, brass, lb,
          kg_per_box, pcs_rate, box_wt, tmp_wt, net_kg, ctn_no, ctn_wt,
          weight_per_ctn, gst, total, grand_total
        ];
        const [result] = await connection.query(insertQuery, values);

        // 2. UPDATE sales_orders
        if (item_code && item_finish && total_pcs > 0) {
          const updateQtyQuery = `
            UPDATE sales_orders
            SET quantity_pcs = GREATEST(quantity_pcs - ?, 0), invoice_status = 'pedding'
            WHERE item_code = ? AND finish = ? AND quantity_pcs > 0
          `;
          await connection.query(updateQtyQuery, [total_pcs, item_code, item_finish]);
        }

        // 3. UPDATE master_items
        if (item_code && total_pcs > 0) {
          const totalKg = parseFloat(net_kg) || 0;
          const updateStockQuery = `
              UPDATE master_items 
              SET stock_quantity = GREATEST(stock_quantity - ?, 0),
                  stock_kg       = GREATEST(COALESCE(stock_kg, 0) - ?, 0)
              WHERE item_code = ?
            `;
          await connection.query(updateStockQuery, [total_pcs, totalKg, item_code]);
        }

        createdInvoices.push({ id: result.insertId, ...invoiceData });
      }

      // LOG 6
      console.log('--- MODEL: All queries successful. Attempting to COMMIT. ---');
      await connection.commit();
      return createdInvoices;

    } catch (error) {
      await connection.rollback();
      // LOG 7 (if an error occurs)
      console.error('--- MODEL: TRANSACTION FAILED & ROLLED BACK ---', error);
      throw error;
    } finally {
      connection.release();
    }
  },
};

module.exports = SalesInvoice;
