const db = require('../config/db');

const PurchaseInvoice = {
  createWithStockUpdate: async (invoiceData, lineItems, userCode, invoiceTotal) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Insert the main invoice record
      const invoiceQuery = 'INSERT INTO purchase_invoices SET ?';
      const [invoiceResult] = await connection.query(invoiceQuery, invoiceData);
      const newInvoiceId = invoiceResult.insertId;

      // Loop through each line item
      if (lineItems && lineItems.length > 0) {
        for (const item of lineItems) {
          // 1. Insert the purchase invoice item as usual
          const { id, ...itemData } = item; // Exclude any temporary front-end ID
          itemData.invoice_id = newInvoiceId;
          const itemQuery = 'INSERT INTO purchase_invoice_items SET ?';
          await connection.query(itemQuery, itemData);

          // --- ENHANCED STOCK UPDATE & SUPPLIER MERGE LOGIC ---
          const totalPcs = parseFloat(item.total_psc || item.quantity_pcs || item.pcs) || 0;
          const totalKg = parseFloat(item.net_kg || item.total_kg || item.kg) || 0;
          const itemCodeVal = item.code || item.item_code;
          const userVal = userCode || invoiceData.code_user || item.user;

          if (itemCodeVal && (totalPcs > 0 || totalKg > 0)) {
            // 1. Master Items Stock Update
            const stockUpdateQuery = `
              UPDATE master_items 
              SET stock_quantity = stock_quantity + ?, 
                  stock_kg       = COALESCE(stock_kg, 0) + ?
              WHERE item_code = ?
            `;
            await connection.query(stockUpdateQuery, [totalPcs, totalKg, itemCodeVal]);

            // 2. Stock History Insert (CREDIT - PURCHASE)
            try {
              const [mRows] = await connection.query(
                'SELECT item_code FROM master_items WHERE item_code = ? LIMIT 1',
                [itemCodeVal]
              );
              if (mRows.length > 0) {
                const historyQuery = `
                  INSERT INTO stock_history
                  (item_code, transaction_type, invoice_type, invoice_number,
                   quantity_pcs, quantity_kg, movement_date, note, user_id)
                  VALUES (?, 'CREDIT', 'PURCHASE', ?, ?, ?, ?, ?, ?)
                `;
                await connection.query(historyQuery, [
                  itemCodeVal,
                  invoiceData.invoice_number || null,
                  totalPcs,
                  totalKg,
                  invoiceData.issue_date || new Date(),
                  null,
                  invoiceData.created_by || null
                ]);
              }
            } catch (historyErr) {
              console.log('Stock history insert skipped (non-master item or FK constraint):', historyErr.message);
            }

            // 3. Box Inventory Update (Pcs)
            const updateBoxQuery = `
              UPDATE box_inventory 
              SET box_quantity = box_quantity + ? 
              WHERE box_name = ?
            `;
            await connection.query(updateBoxQuery, [totalPcs > 0 ? totalPcs : totalKg, itemCodeVal]);

            // 4. Shrink Inventory Update (KG)
            const updateShrinkQuery = `
              UPDATE shrink_inventory 
              SET shrink_quantity = shrink_quantity + ? 
              WHERE shrink_name = ?
            `;
            await connection.query(updateShrinkQuery, [totalKg > 0 ? totalKg : totalPcs, itemCodeVal]);

            // 5. LD Inventory Update (KG)
            const updateLdQuery = `
              UPDATE ld_inventory 
              SET ld_quantity = ld_quantity + ? 
              WHERE ld_name = ?
            `;
            await connection.query(updateLdQuery, [totalKg > 0 ? totalKg : totalPcs, itemCodeVal]);

            // 6. Supplier Inventory Items Sync (code_user merging)
            if (userVal) {
              const cleanFinish = item.finish ? String(item.finish).trim().replace(/\s+/g, '') : '';
              const codeUser = cleanFinish ? `${itemCodeVal}${userVal}_${cleanFinish}` : `${itemCodeVal}${userVal}`;

              const [invRows] = await connection.query(
                'SELECT id FROM inventory_items WHERE code_user = ? OR (item_code = ? AND user = ?)',
                [codeUser, itemCodeVal, userVal]
              );

              if (invRows.length > 0) {
                const invId = invRows[0].id;
                const updateInvQuery = `
                  UPDATE inventory_items 
                  SET stock_quantity = stock_quantity + ?,
                      total_kg = total_kg + ?
                  WHERE id = ?
                `;
                await connection.query(updateInvQuery, [totalPcs, totalKg, invId]);
              } else {
                const insertInvQuery = `
                  INSERT INTO inventory_items 
                  (item_code, user, code_user, finish, description, stock_quantity, total_kg, created_by)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `;
                await connection.query(insertInvQuery, [
                  itemCodeVal,
                  userVal,
                  codeUser,
                  item.finish || null,
                  item.description || null,
                  totalPcs,
                  totalKg,
                  invoiceData.created_by || null
                ]);
              }
            }
          }
          // --- END OF ENHANCED LOGIC ---
        }
      }

      // Calculate and set total_amount and balance_due on the invoice
      const [totalRows] = await connection.query(
        'SELECT COALESCE(SUM(amount), 0) as total FROM purchase_invoice_items WHERE invoice_id = ?',
        [newInvoiceId]
      );
      const calculatedTotal = parseFloat(totalRows[0].total) || 0;
      await connection.query(
        'UPDATE purchase_invoices SET total_amount = ?, balance_due = ? WHERE id = ?',
        [calculatedTotal, calculatedTotal, newInvoiceId]
      );

      // Update supplier's total amount if applicable
      const rawSupplierCode = userCode || invoiceData.code_user || invoiceData.supplier_code || invoiceData.user || '';
      const supplierCodeVal = String(rawSupplierCode).trim();
      const finalInvoiceTotal = calculatedTotal > 0 ? calculatedTotal : (parseFloat(invoiceTotal) || 0);

      if (supplierCodeVal && finalInvoiceTotal > 0) {
        try {
          const baseCode = supplierCodeVal.split('_')[0];
          const [contacts] = await connection.query(
            'SELECT id FROM contacts WHERE code = ? OR code = ? OR contact_name = ? LIMIT 1',
            [supplierCodeVal, baseCode, supplierCodeVal]
          );

          if (contacts.length > 0) {
            const contactId = contacts[0].id;
            const [supRows] = await connection.query(
              'SELECT id FROM supplier_details WHERE contact_id = ? LIMIT 1',
              [contactId]
            );

            if (supRows.length > 0) {
              await connection.query(
                'UPDATE supplier_details SET total_amount = COALESCE(total_amount, 0) + ? WHERE contact_id = ?',
                [finalInvoiceTotal, contactId]
              );
            } else {
              await connection.query(
                'INSERT INTO supplier_details (contact_id, total_amount) VALUES (?, ?)',
                [contactId, finalInvoiceTotal]
              );
            }
          }
        } catch (supplierErr) {
          console.log('Supplier total update error:', supplierErr.message);
        }
      }

      await connection.commit();
      return { id: newInvoiceId, ...invoiceData, line_items: lineItems };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // REPLACE the old updateWithItems function with this one

  updateWithItems: async (invoiceId, invoiceData, lineItems = [], deletedItemIds = []) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Step 1: Update the main invoice details
      if (Object.keys(invoiceData).length > 0) {
        await connection.query('UPDATE purchase_invoices SET ? WHERE id = ?', [invoiceData, invoiceId]);
      }

      // Step 2: Delete any items that were removed
      if (deletedItemIds.length > 0) {
        const deleteQuery = 'DELETE FROM purchase_invoice_items WHERE id IN (?) AND invoice_id = ?';
        await connection.query(deleteQuery, [deletedItemIds, invoiceId]);
      }

      // Step 3: Loop through items to ONLY update existing ones
      for (const item of lineItems) {
        // This 'if' block remains the same.
        if (item.id) {
          // If it has an ID, it's an existing item. UPDATE it.
          const { id, ...itemData } = item;
          await connection.query('UPDATE purchase_invoice_items SET ? WHERE id = ? AND invoice_id = ?', [itemData, id, invoiceId]);
        }
        // --- CHANGE: The 'else' block below has been completely removed. ---
        // else {
        //    // If it has no ID, it's a new item. INSERT it.
        //    item.invoice_id = invoiceId;
        //    await connection.query('INSERT INTO purchase_invoice_items SET ?', item);
        // }
      }

      await connection.commit();
      const updatedItems = await connection.query('SELECT * FROM purchase_invoice_items WHERE invoice_id = ?', [invoiceId]);
      return { id: invoiceId, ...invoiceData, line_items: updatedItems[0] };

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  findAll: async () => {
    const [rows] = await db.query(`
      SELECT *,
        CASE
          WHEN balance_due = 0 AND total_amount > 0 THEN 'Paid'
          WHEN balance_due > 0 AND balance_due < total_amount THEN 'Partial'
          ELSE 'Pending'
        END AS status
      FROM purchase_invoices ORDER BY issue_date DESC
    `);
    return rows;
  },

  // Paginated search with multi-term support
  findAllPaginated: async ({ page = 1, limit = 10, search = '' }) => {
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];

    if (search && search.trim()) {
      const terms = search.trim().split(/\s+/).filter(t => t.length > 0);
      if (terms.length > 0) {
        const searchFields = ['invoice_number', 'code_user', 'supplier_name'];

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

    const countQuery = `SELECT COUNT(*) as total FROM purchase_invoices ${whereClause}`;
    const [countResult] = await db.query(countQuery, queryParams);
    const total = countResult[0].total;

    const dataQuery = `SELECT *,
        CASE
          WHEN balance_due = 0 AND total_amount > 0 THEN 'Paid'
          WHEN balance_due > 0 AND balance_due < total_amount THEN 'Partial'
          ELSE 'Pending'
        END AS status
      FROM purchase_invoices ${whereClause} ORDER BY issue_date DESC LIMIT ? OFFSET ?`;
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
    const [rows] = await db.query(`
      SELECT *,
        CASE
          WHEN balance_due = 0 AND total_amount > 0 THEN 'Paid'
          WHEN balance_due > 0 AND balance_due < total_amount THEN 'Partial'
          ELSE 'Pending'
        END AS status
      FROM purchase_invoices WHERE id = ?
    `, [id]);
    return rows.length > 0 ? rows[0] : null;
  },

  findAllWithTotalAmount: async () => {
    const query = `
      SELECT
        pi.id,
        pi.code_user,
        pi.invoice_number,
        pi.issue_date,
        COALESCE(SUM(pii.amount), 0.00) AS total_amount
      FROM
        purchase_invoices AS pi
      LEFT JOIN
        purchase_invoice_items AS pii ON pi.id = pii.invoice_id
      GROUP BY
        pi.id
      ORDER BY
        pi.issue_date DESC;
    `;
    const [rows] = await db.query(query);
    return rows;
  },

  findItemsByInvoiceId: async (invoiceId) => {
    const [rows] = await db.query('SELECT * FROM purchase_invoice_items WHERE invoice_id = ?', [invoiceId]);
    return rows;
  },

  undoInvoice: async (id, undoByUserId = null, undoReason = null) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Get the purchase invoice details
      const [invoiceRows] = await connection.query(
        `SELECT id, invoice_number, issue_date, code_user, total_amount
         FROM purchase_invoices WHERE id = ? LIMIT 1 FOR UPDATE`,
        [id]
      );

      if (invoiceRows.length === 0) {
        await connection.rollback();
        return { success: false, message: 'Purchase invoice not found' };
      }

      const invoice = invoiceRows[0];

      // 2. Get all line items for this invoice
      const [items] = await connection.query(
        `SELECT code, total_psc, net_kg, total_kg
         FROM purchase_invoice_items WHERE invoice_id = ? FOR UPDATE`,
        [id]
      );

      // 3. Reverse stock for each item (DEBIT - remove stock that was added)
      for (const item of items) {
        const itemCode = item.code;
        const totalPcs = parseFloat(item.total_psc) || 0;
        const totalKg = parseFloat(item.net_kg || item.total_kg) || 0;

        if (!itemCode || totalPcs <= 0) continue;

        // Reverse the stock quantity and kg
        await connection.query(
          `UPDATE master_items
           SET stock_quantity = stock_quantity - ?,
               stock_kg = COALESCE(stock_kg, 0) - ?
           WHERE item_code = ?`,
          [totalPcs, totalKg, itemCode]
        );

        // Insert stock history (DEBIT - stock out via undo purchase invoice)
        try {
          const [mRows] = await connection.query(
            'SELECT item_code FROM master_items WHERE item_code = ? LIMIT 1',
            [itemCode]
          );
          if (mRows.length > 0) {
            await connection.query(
              `INSERT INTO stock_history
              (item_code, transaction_type, invoice_type, invoice_number,
               quantity_pcs, quantity_kg, movement_date, note, user_id)
              VALUES (?, 'DEBIT', 'PURCHASE', ?, ?, ?, ?, ?, ?)`,
              [
                itemCode,
                invoice.invoice_number || null,
                totalPcs,
                totalKg,
                new Date(),
                undoReason || `Undo purchase invoice ${invoice.invoice_number || id}`,
                undoByUserId || null
              ]
            );
          }
        } catch (historyErr) {
          console.log('Stock history undo insert skipped:', historyErr.message);
        }
      }

      // 4. Reverse supplier's total amount (if supplier_details table exists)
      const codeUser = invoice.code_user;
      const totalAmount = parseFloat(invoice.total_amount) || 0;

      if (codeUser && totalAmount > 0) {
        const [contactRows] = await connection.query(
          'SELECT id FROM contacts WHERE code = ? LIMIT 1',
          [codeUser]
        );

        if (contactRows.length > 0) {
          const contactId = contactRows[0].id;

          // Try to update supplier_details if it exists
          try {
            await connection.query(
              `UPDATE supplier_details
               SET total_amount = COALESCE(total_amount, 0) - ?
               WHERE contact_id = ?`,
              [totalAmount, contactId]
            );
          } catch (supplierError) {
            // If supplier_details table doesn't exist, just log and continue
            console.log('Note: supplier_details table may not exist, skipping supplier total update');
          }
        }
      }

      // 5. Finally hard delete the purchase invoice (children auto-delete via FK)
      const [deleteResult] = await connection.query('DELETE FROM purchase_invoices WHERE id = ?', [id]);

      await connection.commit();
      return {
        success: true,
        deletedCount: deleteResult.affectedRows,
        reversedItems: items.length,
        invoice_number: invoice.invoice_number
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  deleteInvoice: async (id) => {
    const [result] = await db.query('DELETE FROM purchase_invoices WHERE id = ?', [id]);
    return result.affectedRows;
  },

  getDetailsByCodeUser: async (codeUser) => {
    const query = `
      SELECT scrap, labour, kg_dzn, total_kg, description, rate_pcs, box_name, shrink_name, ld_name 
      FROM inventory_items 
      WHERE code_user = ? 
         OR code_user LIKE CONCAT(?, '_%') 
         OR CONCAT(item_code, user) = ?
         OR code_user LIKE CONCAT(?, '%')
      ORDER BY id DESC 
      LIMIT 1
    `;
    const [rows] = await db.query(query, [codeUser, codeUser, codeUser, codeUser]);
    return rows.length ? rows[0] : null;
  },

  findImagesByInvoiceId: async (invoiceId) => {
    const [rows] = await db.query('SELECT * FROM purchase_invoice_images WHERE invoice_id = ?', [invoiceId]);
    return rows;
  },
  findCodeUserByUser: async (user) => {
    const [rows] = await db.query('SELECT code_user FROM inventory_items WHERE user = ?', [user]);
    return rows.map(row => row.code_user);
  },
};

module.exports = PurchaseInvoice;