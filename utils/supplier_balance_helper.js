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
    const piConditions = [];
    const piParams = [];

    if (cCode) {
      piConditions.push('user = ? OR code_user = ? OR code_user LIKE ?');
      piParams.push(cCode, cCode, `${cCode}_%`);
    }
    if (cName) {
      piConditions.push('user = ? OR code_user = ?');
      piParams.push(cName, cName);
    }

    const piWhere = piConditions.length > 0 ? `WHERE (${piConditions.join(' OR ')})` : 'WHERE 1=0';

    const [invoices] = await conn.query(
      `SELECT id, invoice_number, issue_date, total_amount, balance_due 
       FROM purchase_invoices 
       ${piWhere}
       ORDER BY 
         COALESCE(STR_TO_DATE(issue_date, '%Y-%m-%d'), STR_TO_DATE(issue_date, '%d-%m-%Y'), '1970-01-01') ASC, 
         id ASC 
       FOR UPDATE`,
      piParams
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

/**
 * Recalculate FIFO purchase invoice Net KG balances and total Net KG balance for a supplier.
 * 
 * Ensures:
 * 1. KG deductions settle opening_net_kg first, then purchase invoices in strict chronological order.
 * 2. purchase_invoices.balance_net_kg and supplier_details.total_net_kg always reflect exact math.
 * 
 * @param {number|string} identifier - contact_id, supplier code, or contact_name
 * @param {object} [existingConnection] - Optional MySQL connection
 */
async function recalculateSupplierKGBalances(identifier, existingConnection = null) {
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

    // Step 2: Get supplier opening net kg and material type
    const [sdRows] = await conn.query(
      'SELECT id, material_type, opening_net_kg, total_net_kg FROM supplier_details WHERE contact_id = ? LIMIT 1',
      [cId]
    );
    const openingNetKg = Math.max(0, parseFloat(sdRows[0]?.opening_net_kg) || 0);
    const materialType = sdRows[0]?.material_type || null;

    // Step 3: Get total KG deductions for this supplier
    const [kgDeductionRows] = await conn.query(
      'SELECT COALESCE(SUM(net_kg), 0) AS total_kg_deductions FROM supplier_kg_deductions WHERE contact_id = ?',
      [cId]
    );
    const totalKgDeductions = parseFloat(kgDeductionRows[0]?.total_kg_deductions) || 0;

    // Step 4: Get all purchase invoices for this supplier in chronological order
    const piConditions = [];
    const piParams = [];

    if (cCode) {
      piConditions.push('pi.user = ? OR pi.code_user = ? OR pi.code_user LIKE ?');
      piParams.push(cCode, cCode, `${cCode}_%`);
    }
    if (cName) {
      piConditions.push('pi.user = ? OR pi.code_user = ?');
      piParams.push(cName, cName);
    }

    const piWhere = piConditions.length > 0 ? `WHERE (${piConditions.join(' OR ')})` : 'WHERE 1=0';

    const [invoices] = await conn.query(
      `SELECT pi.id, pi.invoice_number, pi.issue_date, 
              COALESCE(
                (SELECT SUM(net_kg) FROM purchase_invoice_items WHERE invoice_id = pi.id),
                pi.total_net_kg,
                0
              ) AS calculated_net_kg,
              pi.total_net_kg, pi.balance_net_kg, pi.material_type
       FROM purchase_invoices pi
       ${piWhere}
       ORDER BY 
         COALESCE(STR_TO_DATE(pi.issue_date, '%Y-%m-%d'), STR_TO_DATE(pi.issue_date, '%d-%m-%Y'), '1970-01-01') ASC, 
         pi.id ASC 
       FOR UPDATE`,
      piParams
    );

    // Step 5: FIFO Allocation for Net KG
    let remainingDeduction = totalKgDeductions;

    // 1. Settle opening Net KG first
    const settledOpeningKg = Math.min(remainingDeduction, openingNetKg);
    remainingDeduction -= settledOpeningKg;

    // 2. Settle purchase invoices Net KG in FIFO order
    let totalInvoicesNetKg = 0;
    let totalPINetKgDue = 0;
    const updatedInvoices = [];

    for (const inv of invoices) {
      const invNetKg = parseFloat(inv.calculated_net_kg) || 0;
      totalInvoicesNetKg += invNetKg;

      const kgDeduction = Math.min(remainingDeduction, invNetKg);
      const correctBalanceNetKg = Math.max(0, parseFloat((invNetKg - kgDeduction).toFixed(3)));
      remainingDeduction -= kgDeduction;
      totalPINetKgDue += correctBalanceNetKg;

      const currentBalanceNetKg = parseFloat(inv.balance_net_kg) || 0;
      const currentTotalNetKg = parseFloat(inv.total_net_kg) || 0;
      const currentMatType = inv.material_type;

      if (
        Math.abs(currentBalanceNetKg - correctBalanceNetKg) > 0.001 ||
        Math.abs(currentTotalNetKg - invNetKg) > 0.001 ||
        (materialType && currentMatType !== materialType)
      ) {
        await conn.query(
          'UPDATE purchase_invoices SET total_net_kg = ?, balance_net_kg = ?, material_type = COALESCE(material_type, ?) WHERE id = ?',
          [invNetKg, correctBalanceNetKg, materialType, inv.id]
        );
        updatedInvoices.push({
          id: inv.id,
          invoice_number: inv.invoice_number,
          totalNetKg: invNetKg,
          oldBalanceNetKg: currentBalanceNetKg,
          newBalanceNetKg: correctBalanceNetKg
        });
      }
    }

    // Step 6: Sync supplier_details total_net_kg
    // Total Net KG = Opening Net KG + All PI Net KG - All Deductions
    const calculatedSupplierTotalNetKg = parseFloat((openingNetKg + totalInvoicesNetKg - totalKgDeductions).toFixed(3));
    if (sdRows.length > 0) {
      await conn.query(
        'UPDATE supplier_details SET total_net_kg = ?, material_type = COALESCE(material_type, ?) WHERE contact_id = ?',
        [calculatedSupplierTotalNetKg, materialType, cId]
      );
    }

    if (shouldManageTransaction) {
      await conn.commit();
    }

    return {
      success: true,
      contact: { id: cId, code: cCode, name: cName },
      materialType,
      openingNetKg,
      totalKgDeductions,
      totalInvoicesNetKg,
      calculatedSupplierTotalNetKg,
      totalPINetKgDue,
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

module.exports = {
  recalculateSupplierPIBalances,
  recalculateAllSuppliersBalances,
  recalculateSupplierKGBalances
};
