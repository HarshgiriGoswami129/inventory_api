const db = require('../config/db');

/**
 * Recalculate FIFO purchase invoice balances and total supplier balance for a supplier.
 * 
 * Ensures:
 * 1. Advance payments / credits automatically reduce subsequent purchase invoice balance_due.
 * 2. Payments settle Opening Due first, then purchase invoices in strict chronological order.
 * 3. purchase_invoices.balance_due and supplier_details.total_amount always reflect exact math.
 * 
 * @param {number|string} identifier - contact_id, supplier code, or contact_name
 * @param {object} [existingConnection] - Optional MySQL connection if called inside an existing transaction
 */
async function recalculateSupplierPIBalances(identifier, existingConnection = null) {
  if (!identifier) return { success: false, message: 'No supplier identifier provided' };

  const conn = existingConnection || (await db.getConnection());
  const shouldManageTransaction = !existingConnection;

  try {
    if (shouldManageTransaction) {
      await conn.beginTransaction();
    }

    // Step 1: Resolve contact
    let contact = null;
    const numId = parseInt(identifier, 10);
    if (!isNaN(numId) && numId > 0 && String(numId) === String(identifier).trim()) {
      const [rows] = await conn.query(
        'SELECT id, code, contact_name FROM contacts WHERE id = ? LIMIT 1',
        [numId]
      );
      if (rows.length > 0) contact = rows[0];
    }

    if (!contact && identifier) {
      const raw = String(identifier).trim();
      const base = raw.split('_')[0].trim();
      const [rows] = await conn.query(
        'SELECT id, code, contact_name FROM contacts WHERE code = ? OR code = ? OR contact_name = ? OR contact_name = ? LIMIT 1',
        [raw, base, raw, base]
      );
      if (rows.length > 0) contact = rows[0];
    }

    if (!contact) {
      if (shouldManageTransaction) await conn.rollback();
      return { success: false, message: `Supplier contact not found for: ${identifier}` };
    }

    const cId = contact.id;
    const cCode = String(contact.code || '').trim();
    const cName = String(contact.contact_name || '').trim();

    // Step 2: Get supplier opening balance
    const [sdRows] = await conn.query(
      'SELECT id, opening_balance, total_amount FROM supplier_details WHERE contact_id = ? LIMIT 1',
      [cId]
    );
    const openingBalance = Math.max(0, parseFloat(sdRows[0]?.opening_balance) || 0);

    // Step 3: Get total payments made to this supplier
    const [payRows] = await conn.query(
      'SELECT COALESCE(SUM(amount), 0) AS total_payments FROM payments WHERE contact_id = ?',
      [cId]
    );
    const totalPayments = parseFloat(payRows[0]?.total_payments) || 0;

    // Step 4: Get all purchase invoices for this supplier in chronological order
    const [invoices] = await conn.query(
      `SELECT id, invoice_number, issue_date, total_amount, balance_due 
       FROM purchase_invoices 
       WHERE (
         user = ? OR code_user = ? 
         OR user = ? OR code_user = ?
         OR (code_user LIKE ? AND code_user IS NOT NULL)
       )
       ORDER BY 
         COALESCE(STR_TO_DATE(issue_date, '%Y-%m-%d'), STR_TO_DATE(issue_date, '%d-%m-%Y'), '1970-01-01') ASC, 
         id ASC 
       FOR UPDATE`,
      [cCode, cCode, cName, cName, `${cCode}_%`]
    );

    // Step 5: FIFO Allocation
    let remainingPayment = totalPayments;

    // 1. Settle supplier opening balance first
    const settledOpening = Math.min(remainingPayment, openingBalance);
    remainingPayment -= settledOpening;

    // 2. Settle purchase invoices in FIFO order
    let totalInvoicesAmount = 0;
    let totalPIDue = 0;
    const updatedInvoices = [];

    for (const inv of invoices) {
      const invTotal = parseFloat(inv.total_amount) || 0;
      totalInvoicesAmount += invTotal;

      const deduction = Math.min(remainingPayment, invTotal);
      const correctBalanceDue = Math.max(0, parseFloat((invTotal - deduction).toFixed(2)));
      remainingPayment -= deduction;
      totalPIDue += correctBalanceDue;

      const currentBalanceDue = parseFloat(inv.balance_due) || 0;
      if (Math.abs(currentBalanceDue - correctBalanceDue) > 0.001) {
        await conn.query(
          'UPDATE purchase_invoices SET balance_due = ? WHERE id = ?',
          [correctBalanceDue, inv.id]
        );
        updatedInvoices.push({
          id: inv.id,
          invoice_number: inv.invoice_number,
          oldBalance: currentBalanceDue,
          newBalance: correctBalanceDue
        });
      }
    }

    // Step 6: Sync supplier_details total_amount
    const calculatedSupplierTotal = parseFloat((openingBalance + totalInvoicesAmount - totalPayments).toFixed(2));
    if (sdRows.length > 0) {
      await conn.query(
        'UPDATE supplier_details SET total_amount = ? WHERE contact_id = ?',
        [calculatedSupplierTotal, cId]
      );
    }

    if (shouldManageTransaction) {
      await conn.commit();
    }

    return {
      success: true,
      contact: { id: cId, code: cCode, name: cName },
      openingBalance,
      totalPayments,
      totalInvoicesAmount,
      calculatedSupplierTotal,
      totalPIDue,
      updatedInvoices
    };
  } catch (error) {
    if (shouldManageTransaction) {
      await conn.rollback();
    }
    throw error;
  } finally {
    if (shouldManageTransaction) {
      conn.release();
    }
  }
}

/**
 * Recalculate balances for all suppliers
 */
async function recalculateAllSuppliersBalances(existingConnection = null) {
  const conn = existingConnection || (await db.getConnection());
  const shouldManageTransaction = !existingConnection;

  try {
    if (shouldManageTransaction) {
      await conn.beginTransaction();
    }

    const [suppliers] = await conn.query('SELECT contact_id FROM supplier_details');
    const results = [];

    for (const s of suppliers) {
      if (s.contact_id) {
        const res = await recalculateSupplierPIBalances(s.contact_id, conn);
        results.push(res);
      }
    }

    if (shouldManageTransaction) {
      await conn.commit();
    }

    return { success: true, count: results.length, details: results };
  } catch (error) {
    if (shouldManageTransaction) {
      await conn.rollback();
    }
    throw error;
  } finally {
    if (shouldManageTransaction) {
      conn.release();
    }
  }
}

module.exports = {
  recalculateSupplierPIBalances,
  recalculateAllSuppliersBalances
};
