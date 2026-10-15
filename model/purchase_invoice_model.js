const db = require('../config/db');

const PurchaseInvoice = {
  createWithStockUpdate: async (invoiceData, lineItems, userCode, invoiceTotal) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Allowed fields for purchase_invoices table
      const allowedInvoiceFields = [
        'code_user', 'user', 'invoice_number', 'issue_date', 'due_date',
        'total_amount', 'balance_due', 'image_url'
      ];
      const sanitizedInvoice = {};
      for (const field of allowedInvoiceFields) {
        if (invoiceData[field] !== undefined) {
          sanitizedInvoice[field] = invoiceData[field];
        }
      }

      // Sanitize main invoice dates and fields to avoid MySQL strict mode errors
      if (!sanitizedInvoice.issue_date || (typeof sanitizedInvoice.issue_date === 'string' && sanitizedInvoice.issue_date.trim() === '')) {
        sanitizedInvoice.issue_date = new Date().toISOString().split('T')[0];
      }
      if (!sanitizedInvoice.due_date || (typeof sanitizedInvoice.due_date === 'string' && sanitizedInvoice.due_date.trim() === '')) {
        sanitizedInvoice.due_date = sanitizedInvoice.issue_date;
      }
      if (sanitizedInvoice.image_url === undefined || sanitizedInvoice.image_url === null) {
        sanitizedInvoice.image_url = '';
      }
      if (sanitizedInvoice.code_user === undefined || sanitizedInvoice.code_user === null) {
        sanitizedInvoice.code_user = userCode || invoiceData.supplier_code || '';
      }
      if (sanitizedInvoice.user === undefined || sanitizedInvoice.user === null) {
        sanitizedInvoice.user = invoiceData.user || invoiceData.code_user || '';
      }
      if (sanitizedInvoice.invoice_number === undefined || sanitizedInvoice.invoice_number === null) {
        sanitizedInvoice.invoice_number = '';
      }
      if (sanitizedInvoice.total_amount === undefined && invoiceTotal !== undefined) {
        sanitizedInvoice.total_amount = parseFloat(invoiceTotal) || 0;
      }
      if (sanitizedInvoice.balance_due === undefined) {
        sanitizedInvoice.balance_due = sanitizedInvoice.total_amount || 0;
      }

      // Insert the main invoice record
      const invoiceQuery = 'INSERT INTO purchase_invoices SET ?';
      const [invoiceResult] = await connection.query(invoiceQuery, sanitizedInvoice);
      const newInvoiceId = invoiceResult.insertId;

      const toDec = (val) => {
        if (val === null || val === undefined || val === '') return 0;
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
      };

      const allowedItemFields = [
        'item_code', 'code', 'description', 'stock_kg', 'scrap', 'labour',
        'kg_dzn', 'actual_dzn_wt', 'total_per_6a', 'rate_pcr', 'total_kg',
        'no_of_peti', 'peti_wt', 'peti_balance', 'ret_peti_no', 'peti_Type',
        'net_kg', 'amount', 'notes', 'pati_status', 'pic_or_kg', 'total_psc'
      ];

      // Loop through each line item
      if (lineItems && lineItems.length > 0) {
        for (const item of lineItems) {
          const itemData = {};
          for (const field of allowedItemFields) {
            if (item[field] !== undefined) {
              itemData[field] = item[field];
            }
          }

          if (!itemData.peti_Type && (item.petiType || item.peti_type || item.pati_type || item.patiType)) {
            itemData.peti_Type = item.petiType || item.peti_type || item.pati_type || item.patiType;
          }
          if (!itemData.peti_Type) {
            itemData.peti_Type = 'WD';
          }

          if (!itemData.item_code) {
            itemData.item_code = item.code || item.itemCode || 'ITEM';
          }

          itemData.invoice_id = newInvoiceId;
          itemData.stock_kg = toDec(itemData.stock_kg);
          itemData.scrap = toDec(itemData.scrap);
          itemData.labour = toDec(itemData.labour);
          itemData.kg_dzn = toDec(itemData.kg_dzn);
          itemData.actual_dzn_wt = toDec(itemData.actual_dzn_wt);
          itemData.total_per_6a = toDec(itemData.total_per_6a);
          itemData.rate_pcr = toDec(itemData.rate_pcr);
          itemData.total_kg = toDec(itemData.total_kg);
          itemData.no_of_peti = toDec(itemData.no_of_peti);
          itemData.peti_wt = toDec(itemData.peti_wt);
          itemData.peti_balance = toDec(itemData.peti_balance);
          itemData.ret_peti_no = toDec(itemData.ret_peti_no);
          itemData.net_kg = toDec(itemData.net_kg);
          itemData.amount = toDec(itemData.amount);
          itemData.total_psc = toDec(itemData.total_psc);
          if (itemData.pic_or_kg !== undefined) {
            itemData.pic_or_kg = Number(itemData.pic_or_kg) || 0;
          }

          const itemQuery = 'INSERT INTO purchase_invoice_items SET ?';
          await connection.query(itemQuery, itemData);

          // --- ENHANCED STOCK UPDATE & SUPPLIER MERGE LOGIC ---
          const totalPcs = parseFloat(item.total_psc || item.quantity_pcs || item.pcs) || 0;
          const totalKg = parseFloat(item.net_kg || item.total_kg || item.kg) || 0;
          const itemCodeVal = item.code || item.item_code;
          const userVal = userCode || sanitizedInvoice.code_user || item.user;

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
                  sanitizedInvoice.invoice_number || null,
                  totalPcs,
                  totalKg,
                  sanitizedInvoice.issue_date || new Date(),
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
      const rawSupplierCode = userCode || sanitizedInvoice.code_user || invoiceData.supplier_code || sanitizedInvoice.user || '';
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
      return { id: newInvoiceId, ...sanitizedInvoice, line_items: lineItems };
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

      // Step 1: Update the main invoice details (sanitize fields)
      const allowedInvoiceFields = ['invoice_number', 'issue_date', 'due_date', 'image_url', 'code_user', 'user'];
      const sanitizedInvoice = {};
      for (const field of allowedInvoiceFields) {
        if (invoiceData[field] !== undefined) {
          sanitizedInvoice[field] = invoiceData[field];
        }
      }

      if (sanitizedInvoice.due_date !== undefined && (!sanitizedInvoice.due_date || (typeof sanitizedInvoice.due_date === 'string' && sanitizedInvoice.due_date.trim() === ''))) {
        sanitizedInvoice.due_date = sanitizedInvoice.issue_date || new Date().toISOString().split('T')[0];
      }

      if (Object.keys(sanitizedInvoice).length > 0) {
        await connection.query('UPDATE purchase_invoices SET ? WHERE id = ?', [sanitizedInvoice, invoiceId]);
      }

      // Step 2: Fetch existing items in database for this invoice
      const [existingRows] = await connection.query(
        'SELECT id FROM purchase_invoice_items WHERE invoice_id = ?',
        [invoiceId]
      );
      const existingIdSet = new Set(existingRows.map(r => r.id));

      // Step 3: Determine which items must be deleted:
      // (a) IDs explicitly sent in deletedItemIds
      // (b) Any existing DB items that are NOT present in the received lineItems
      const receivedExistingIds = new Set(
        lineItems
          .filter(i => i.id && existingIdSet.has(Number(i.id)))
          .map(i => Number(i.id))
      );

      const toDeleteSet = new Set([
        ...(Array.isArray(deletedItemIds) ? deletedItemIds.map(Number).filter(id => existingIdSet.has(id)) : []),
        ...existingRows.map(r => r.id).filter(id => !receivedExistingIds.has(id))
      ]);

      if (toDeleteSet.size > 0) {
        await connection.query(
          'DELETE FROM purchase_invoice_items WHERE id IN (?) AND invoice_id = ?',
          [[...toDeleteSet], invoiceId]
        );
      }

      const toDec = (val) => {
        if (val === null || val === undefined || val === '') return 0;
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
      };

      const allowedItemFields = [
        'item_code', 'code', 'description', 'stock_kg', 'scrap', 'labour',
        'kg_dzn', 'actual_dzn_wt', 'total_per_6a', 'rate_pcr', 'total_kg',
        'no_of_peti', 'peti_wt', 'peti_balance', 'ret_peti_no', 'peti_Type',
        'net_kg', 'amount', 'notes', 'pati_status', 'pic_or_kg', 'total_psc'
      ];

      // Step 4: Loop through lineItems - UPDATE existing, INSERT new
      for (const item of lineItems) {
        const isExisting = item.id && existingIdSet.has(Number(item.id)) && !toDeleteSet.has(Number(item.id));

        const itemData = {};
        for (const field of allowedItemFields) {
          if (item[field] !== undefined) {
            itemData[field] = item[field];
          }
        }

        // Support petiType vs peti_Type
        if (!itemData.peti_Type && (item.petiType || item.peti_type || item.pati_type || item.patiType)) {
          itemData.peti_Type = item.petiType || item.peti_type || item.pati_type || item.patiType;
        }
        if (!itemData.peti_Type) {
          itemData.peti_Type = 'WD';
        }

        // Ensure item_code is present
        if (!itemData.item_code) {
          itemData.item_code = item.code || item.itemCode || 'ITEM';
        }

        // Numbers sanitization
        itemData.stock_kg = toDec(itemData.stock_kg);
        itemData.scrap = toDec(itemData.scrap);
        itemData.labour = toDec(itemData.labour);
        itemData.kg_dzn = toDec(itemData.kg_dzn);
        itemData.actual_dzn_wt = toDec(itemData.actual_dzn_wt);
        itemData.rate_pcr = toDec(itemData.rate_pcr);
        itemData.total_kg = toDec(itemData.total_kg);
        itemData.no_of_peti = toDec(itemData.no_of_peti);
        itemData.peti_wt = toDec(itemData.peti_wt);
        itemData.peti_balance = toDec(itemData.peti_balance);
        itemData.ret_peti_no = toDec(itemData.ret_peti_no);
        itemData.net_kg = toDec(itemData.net_kg);
        itemData.amount = toDec(itemData.amount);
        itemData.total_psc = toDec(itemData.total_psc);
        itemData.total_per_6a = toDec(itemData.total_per_6a);
        if (itemData.pic_or_kg !== undefined) {
          itemData.pic_or_kg = Number(itemData.pic_or_kg) || 0;
        }

        if (isExisting) {
          await connection.query(
            'UPDATE purchase_invoice_items SET ? WHERE id = ? AND invoice_id = ?',
            [itemData, item.id, invoiceId]
          );
        } else {
          itemData.invoice_id = invoiceId;
          await connection.query(
            'INSERT INTO purchase_invoice_items SET ?',
            [itemData]
          );
        }
      }

      // Step 5: Recalculate total_amount and balance_due on purchase_invoices
      const [totalRows] = await connection.query(
        'SELECT COALESCE(SUM(amount), 0) as total FROM purchase_invoice_items WHERE invoice_id = ?',
        [invoiceId]
      );
      const newTotal = parseFloat(totalRows[0].total) || 0;

      const [invRows] = await connection.query(
        'SELECT total_amount, balance_due, code_user, user FROM purchase_invoices WHERE id = ?',
        [invoiceId]
      );

      if (invRows.length > 0) {
        const oldTotal = parseFloat(invRows[0].total_amount) || 0;
        const oldBalance = parseFloat(invRows[0].balance_due) || 0;
        const amountPaid = Math.max(0, oldTotal - oldBalance);
        const newBalance = Math.max(0, newTotal - amountPaid);

        await connection.query(
          'UPDATE purchase_invoices SET total_amount = ?, balance_due = ? WHERE id = ?',
          [newTotal, newBalance, invoiceId]
        );

        // Update supplier_details total_amount by delta
        const delta = newTotal - oldTotal;
        const rawSupplierCode = sanitizedInvoice.code_user || invRows[0].code_user || sanitizedInvoice.user || invRows[0].user || '';
        const supplierCodeVal = String(rawSupplierCode).trim();
        if (supplierCodeVal && Math.abs(delta) > 0.001) {
          try {
            const baseCode = supplierCodeVal.split('_')[0];
            const [contacts] = await connection.query(
              'SELECT id FROM contacts WHERE code = ? OR code = ? OR contact_name = ? LIMIT 1',
              [supplierCodeVal, baseCode, supplierCodeVal]
            );
            if (contacts.length > 0) {
              await connection.query(
                'UPDATE supplier_details SET total_amount = COALESCE(total_amount, 0) + ? WHERE contact_id = ?',
                [delta, contacts[0].id]
              );
            }
          } catch (supplierErr) {
            console.log('Supplier total update error:', supplierErr.message);
          }
        }
      }

      await connection.commit();
      const updatedItems = await connection.query('SELECT * FROM purchase_invoice_items WHERE invoice_id = ?', [invoiceId]);
      return { id: invoiceId, ...sanitizedInvoice, line_items: updatedItems[0] };

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
  // Paginated search with multi-field and multi-term support
  findAllPaginated: async ({ page = 1, limit = 10, search = '' }) => {
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];

    if (search && search.trim()) {
      const terms = search.trim().split(/\s+/).filter(Boolean);
      if (terms.length > 0) {
        const termConditions = terms.map(term => {
          const pattern = `%${term}%`;
          queryParams.push(
            pattern, // pi.invoice_number
            pattern, // pi.code_user
            pattern, // pi.user
            pattern, // c.contact_name
            pattern, // pii.item_code
            pattern, // pii.description
            pattern, // pii.code
            pattern, // pii.notes
            pattern  // status
          );
          return `(
            pi.invoice_number LIKE ?
            OR pi.code_user LIKE ?
            OR pi.user LIKE ?
            OR c.contact_name LIKE ?
            OR EXISTS (
              SELECT 1 FROM purchase_invoice_items pii
              WHERE pii.invoice_id = pi.id
              AND (
                pii.item_code LIKE ?
                OR pii.description LIKE ?
                OR pii.code LIKE ?
                OR pii.notes LIKE ?
              )
            )
            OR (
              CASE
                WHEN pi.balance_due = 0 AND pi.total_amount > 0 THEN 'Paid'
                WHEN pi.balance_due > 0 AND pi.balance_due < pi.total_amount THEN 'Partial'
                ELSE 'Pending'
              END
            ) LIKE ?
          )`;
        });

        whereConditions.push(`(${termConditions.join(' AND ')})`);
      }
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countQuery = `
      SELECT COUNT(DISTINCT pi.id) as total
      FROM purchase_invoices pi
      LEFT JOIN contacts c ON (c.code = pi.code_user OR c.code = pi.user OR c.code = SUBSTRING_INDEX(pi.code_user, '_', 1))
      ${whereClause}
    `;
    const [countResult] = await db.query(countQuery, queryParams);
    const total = countResult[0].total;

    const dataQuery = `
      SELECT pi.*,
        c.contact_name AS supplier_contact_name,
        CASE
          WHEN pi.balance_due = 0 AND pi.total_amount > 0 THEN 'Paid'
          WHEN pi.balance_due > 0 AND pi.balance_due < pi.total_amount THEN 'Partial'
          ELSE 'Pending'
        END AS status
      FROM purchase_invoices pi
      LEFT JOIN contacts c ON (c.code = pi.code_user OR c.code = pi.user OR c.code = SUBSTRING_INDEX(pi.code_user, '_', 1))
      ${whereClause}
      ORDER BY pi.issue_date DESC, pi.id DESC
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