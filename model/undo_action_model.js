const db = require('../config/db');
const PurchaseInvoice = require('./purchase_invoice_model');
const NewSalesInvoice = require('./new_sales_invoice_model');

const UndoAction = {
  /**
   * Log an undoable action
   */
  recordAction: async ({
    user_id = null,
    user_name = null,
    module,
    action_type,
    record_id = null,
    record_identifier = null,
    description,
    action_data = null,
  }) => {
    try {
      const sql = `
        INSERT INTO undo_actions
        (user_id, user_name, module, action_type, record_id, record_identifier, description, action_data, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
      `;
      const [result] = await db.query(sql, [
        user_id,
        user_name,
        module,
        action_type,
        record_id,
        record_identifier,
        description,
        action_data ? JSON.stringify(action_data) : null,
      ]);
      return result.insertId;
    } catch (err) {
      console.error('Error recording undo action:', err);
      // Non-blocking: Do not crash the caller if recording undo log fails
      return null;
    }
  },

  /**
   * Get recent undoable actions (default 10)
   */
  getRecentActions: async ({ user_id = null, limit = 10 } = {}) => {
    let sql = 'SELECT * FROM undo_actions WHERE 1=1';
    const params = [];

    if (user_id) {
      sql += ' AND (user_id = ? OR user_id IS NULL)';
      params.push(user_id);
    }

    sql += ' ORDER BY id DESC LIMIT ?';
    params.push(Number(limit) || 10);

    const [rows] = await db.query(sql, params);
    return rows.map((row) => ({
      ...row,
      action_data: typeof row.action_data === 'string' ? JSON.parse(row.action_data) : row.action_data,
    }));
  },

  /**
   * Get single action by ID
   */
  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM undo_actions WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      ...row,
      action_data: typeof row.action_data === 'string' ? JSON.parse(row.action_data) : row.action_data,
    };
  },

  /**
   * Mark an action as UNDONE
   */
  markUndone: async (id) => {
    await db.query(
      'UPDATE undo_actions SET status = "UNDONE", undone_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
  },

  /**
   * Execute rollback for an action
   */
  executeUndo: async (actionId, currentUser = {}) => {
    const action = await UndoAction.getById(actionId);
    if (!action) {
      throw new Error('Undo action not found.');
    }
    if (action.status === 'UNDONE') {
      throw new Error('This action has already been undone.');
    }

    const { module: mod, action_type, record_id, action_data } = action;
    const requestingUserId = (typeof currentUser === 'object' ? (currentUser.id || currentUser.user_id) : currentUser) || action.user_id || null;
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      switch (action_type) {
        // -------------------------------------------------------------------------
        // 1. Inventory Items: Batch Duplicate or Batch Create
        // -------------------------------------------------------------------------
        case 'DUPLICATE_ITEMS':
        case 'BATCH_CREATE_ITEMS': {
          const itemIds = action_data?.created_item_ids || [];
          if (!Array.isArray(itemIds) || itemIds.length === 0) {
            throw new Error('No created item IDs found in undo action record.');
          }

          // Safety check: Check if any of these created items have been used in sales orders
          // (matching customer and item_code)
          const [createdItems] = await connection.query(
            'SELECT id, item_code, user, finish FROM inventory_items WHERE id IN (?)',
            [itemIds]
          );

          if (createdItems.length > 0) {
            // Delete the duplicated items
            const [delResult] = await connection.query(
              'DELETE FROM inventory_items WHERE id IN (?)',
              [itemIds]
            );
            console.log(`Undo duplicate: Deleted ${delResult.affectedRows} items.`);
          }
          break;
        }

        // -------------------------------------------------------------------------
        // 2. Sales Order: Create
        // -------------------------------------------------------------------------
        case 'CREATE_SALES_ORDER': {
          const orderId = record_id || action_data?.order_id;
          if (!orderId) {
            throw new Error('Sales order ID not specified in undo record.');
          }

          // Check if order exists and if already invoiced
          const [soRows] = await connection.query(
            'SELECT id, invoice_status FROM sales_orders WHERE id = ? LIMIT 1',
            [orderId]
          );

          if (soRows.length === 0) {
            throw new Error('Sales order no longer exists or was already deleted.');
          }

          const so = soRows[0];
          if (so.invoice_status === 'Invoiced' || so.invoice_status === 'Partial') {
            throw new Error(
              'Cannot undo: This Sales Order has already been invoiced.'
            );
          }

          await connection.query('DELETE FROM sales_orders WHERE id = ?', [orderId]);
          break;
        }

        // -------------------------------------------------------------------------
        // 3. Sales Invoice: Create
        // -------------------------------------------------------------------------
        case 'CREATE_SALES_INVOICE': {
          const invoiceId = record_id || action_data?.invoice_id;
          if (!invoiceId) {
            throw new Error('Sales invoice ID not specified in undo record.');
          }

          // Check if invoice exists in invoices table
          const [invRows] = await connection.query(
            'SELECT id FROM invoices WHERE id = ? LIMIT 1',
            [invoiceId]
          );

          if (invRows.length > 0) {
            const result = await NewSalesInvoice.undoInvoice(
              invoiceId,
              requestingUserId || user_id,
              'Undone via Undo Action',
              connection
            );

            if (!result.success) {
              throw new Error(result.message || 'Failed to undo sales invoice.');
            }
          } else {
            // Fallback for legacy sales_invoice table
            const [legacyRows] = await connection.query(
              'SELECT * FROM sales_invoice WHERE id = ? LIMIT 1',
              [invoiceId]
            );

            if (legacyRows.length === 0) {
              throw new Error('Sales invoice no longer exists or was already deleted.');
            }

            const inv = legacyRows[0];
            const itemCode = action_data?.item_code || inv.item_code;
            const totalPcs = parseFloat(action_data?.total_pcs ?? inv.total_pcs) || 0;
            const netKg = parseFloat(action_data?.net_kg ?? inv.net_kg) || 0;

            if (itemCode && (totalPcs > 0 || netKg > 0)) {
              await connection.query(
                `UPDATE master_items 
                 SET stock_quantity = stock_quantity + ?, 
                     stock_kg = COALESCE(stock_kg, 0) + ? 
                 WHERE item_code = ?`,
                [totalPcs, netKg, itemCode]
              );
            }

            await connection.query('DELETE FROM sales_invoice WHERE id = ?', [invoiceId]);
          }
          break;
        }

        // -------------------------------------------------------------------------
        // 4. Purchase Invoice: Create
        // -------------------------------------------------------------------------
        case 'CREATE_PURCHASE_INVOICE': {
          const invoiceId = record_id || action_data?.invoice_id;
          if (!invoiceId) {
            throw new Error('Purchase invoice ID not specified in undo record.');
          }

          // Use the complete undoInvoice implementation which reverses:
          // 1. Supplier details total_amount in supplier_details
          // 2. Stock in master_items (stock_quantity and stock_kg)
          // 3. Inserts DEBIT reversal in stock_history
          // 4. Stock in box_inventory, shrink_inventory, ld_inventory
          // 5. Stock in inventory_items (code_user)
          // 6. Deletes line items and invoice record
          const result = await PurchaseInvoice.undoInvoice(
            invoiceId,
            requestingUserId || user_id,
            'Undone via Undo Action',
            connection
          );

          if (!result.success) {
            throw new Error(result.message || 'Failed to undo purchase invoice.');
          }
          break;
        }

        // -------------------------------------------------------------------------
        // 5. Batch Delete: Restore deleted records
        // -------------------------------------------------------------------------
        case 'BATCH_DELETE': {
          const tableName = action_data?.table_name;
          const deletedRecords = action_data?.deleted_records || [];

          if (!tableName || !Array.isArray(deletedRecords) || deletedRecords.length === 0) {
            throw new Error('No backup records available to restore.');
          }

          for (const record of deletedRecords) {
            await connection.query(`INSERT INTO ?? SET ?`, [tableName, record]);
          }
          break;
        }

        // -------------------------------------------------------------------------
        // 6. Batch Edit: Restore previous values
        // -------------------------------------------------------------------------
        case 'BATCH_EDIT': {
          const tableName = action_data?.table_name;
          const previousValues = action_data?.previous_values || [];

          if (!tableName || !Array.isArray(previousValues) || previousValues.length === 0) {
            throw new Error('No previous values available to restore.');
          }

          for (const item of previousValues) {
            const { id, ...oldFields } = item;
            if (id && Object.keys(oldFields).length > 0) {
              await connection.query(`UPDATE ?? SET ? WHERE id = ?`, [tableName, oldFields, id]);
            }
          }
          break;
        }

        default:
          throw new Error(`Unsupported undo action type: ${action_type}`);
      }

      // Mark the action as UNDONE
      await connection.query(
        'UPDATE undo_actions SET status = "UNDONE", undone_at = CURRENT_TIMESTAMP WHERE id = ?',
        [actionId]
      );

      await connection.commit();
      return { success: true, message: `Successfully undone: ${action.description}` };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },
};

module.exports = UndoAction;
