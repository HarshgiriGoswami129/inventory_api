/**
 * Sales Orders & Invoices Reconciliation Script
 * 
 * Usage:
 *   node scripts/reconcile_orders.js         # Dry-run audit mode (reports discrepancies)
 *   node scripts/reconcile_orders.js --fix   # Fix mode (updates sales_orders to match invoices)
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const db = require('../config/db');

async function reconcile() {
  const isFix = process.argv.includes('--fix');
  console.log(`\n============================================================`);
  console.log(`  SALES ORDERS & INVOICES RECONCILIATION TOOL`);
  console.log(`  Mode: ${isFix ? 'FIX (Database will be updated)' : 'AUDIT / DRY RUN (Read-only)'}`);
  console.log(`============================================================\n`);

  try {
    // 1. Fetch all sales orders
    const [orders] = await db.query(`
      SELECT id, order_number, customer_code, customer_id, item_code, finish, initial_qty, quantity_pcs, invoice_status
      FROM sales_orders
      ORDER BY id ASC
    `);

    // 2. Fetch all invoice items from active invoices
    const [invoiceItems] = await db.query(`
      SELECT ii.id, ii.invoice_id, ii.item_code, ii.item_finish, ii.total_pcs, i.invoice_number, i.customer_id
      FROM invoice_items ii
      JOIN invoices i ON ii.invoice_id = i.id
      ORDER BY i.id ASC, ii.id ASC
    `);

    console.log(`Found ${orders.length} Sales Orders and ${invoiceItems.length} Invoice Items across all Invoices.\n`);

    const discrepancies = [];
    let fixedCount = 0;

    for (const so of orders) {
      const initialQty = parseFloat(so.initial_qty) || 0;
      const currentRemaining = parseFloat(so.quantity_pcs) || 0;
      const custCode = String(so.customer_code || '').trim();
      const custId = String(so.customer_id || '').trim();
      const itemCode = String(so.item_code || '').trim();
      const finish = String(so.finish || '').trim();

      // Find all invoice items matching this SO
      const matchingInvoices = invoiceItems.filter((ii) => {
        const iiItem = String(ii.item_code || '').trim();
        const iiFinish = String(ii.item_finish || '').replace(/\s*\(Scrap:.*?\)\s*/gi, '').trim();
        const iiCust = String(ii.customer_id || '').trim();

        const itemMatches = (iiItem === itemCode || itemCode.startsWith(iiItem) || iiItem.startsWith(itemCode));
        const custMatches = (iiCust === custCode || custId.includes(iiCust) || iiCust.includes(custCode));
        const finishMatches = !finish || !iiFinish || iiFinish.toLowerCase() === finish.toLowerCase();

        return itemMatches && custMatches && finishMatches;
      });

      const totalInvoicedPcs = matchingInvoices.reduce((sum, inv) => sum + (parseFloat(inv.total_pcs) || 0), 0);
      const expectedRemaining = Math.max(0, initialQty - totalInvoicedPcs);

      if (Math.abs(currentRemaining - expectedRemaining) > 0.001) {
        let expectedStatus = 'Uninvoiced';
        if (expectedRemaining <= 0) {
          expectedStatus = 'Invoiced';
        } else if (expectedRemaining < initialQty) {
          expectedStatus = 'Partial';
        }

        discrepancies.push({
          so_id: so.id,
          customer: custCode || custId,
          item: itemCode,
          finish: finish,
          initial_qty: initialQty,
          total_invoiced_pcs: totalInvoicedPcs,
          current_qty: currentRemaining,
          expected_qty: expectedRemaining,
          current_status: so.invoice_status,
          expected_status: expectedStatus,
          invoices: matchingInvoices.map((m) => `${m.invoice_number} (${m.total_pcs} pcs)`).join(', ') || 'None',
        });

        if (isFix) {
          await db.query(
            'UPDATE sales_orders SET quantity_pcs = ?, invoice_status = ? WHERE id = ?',
            [expectedRemaining, expectedStatus, so.id]
          );
          fixedCount++;
        }
      }
    }

    if (discrepancies.length === 0) {
      console.log('✓ All Sales Orders and Sales Invoices are in 100% PERFECT SYNC. No errors found!\n');
    } else {
      console.log(`Found ${discrepancies.length} discrepancy order(s):\n`);
      console.table(discrepancies.map((d) => ({
        'SO ID': d.so_id,
        'Customer': d.customer,
        'Item': d.item,
        'Finish': d.finish,
        'Init Qty': d.initial_qty,
        'Invoiced': d.total_invoiced_pcs,
        'Current Remaining': d.current_qty,
        'Correct Remaining': d.expected_qty,
        'New Status': d.expected_status,
        'Invoices': d.invoices,
      })));

      if (isFix) {
        console.log(`\n✓ SUCCESS: Successfully fixed ${fixedCount} Sales Order(s) in the database.`);
      } else {
        console.log(`\nNotice: Run with --fix to automatically correct these ${discrepancies.length} orders:`);
        console.log(`  node scripts/reconcile_orders.js --fix\n`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Reconciliation error:', error);
    process.exit(1);
  }
}

reconcile();
