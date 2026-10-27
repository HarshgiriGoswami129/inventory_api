const db = require('../config/db');
const Payment = {
  create: async (paymentData) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Destructure payment data
      const { date, amount, account_id, contact_id, description, reference, note, image_url, user_id } = paymentData;

      // 1. Insert the new payment record (existing logic)
      const paymentQuery = 'INSERT INTO payments (date, amount, account_id, contact_id, description, reference, note, image_url, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const [paymentResult] = await connection.query(paymentQuery, [date, amount, account_id, contact_id, description, reference, note, image_url, user_id]);

      // 2. Update the account balance (existing logic)
      const updateAccountQuery = 'UPDATE accounts SET balance = balance - ? WHERE id = ?';
      await connection.query(updateAccountQuery, [amount, account_id]);

      // 2.5: Get updated balance and contact info for account history
      const [accountRows] = await connection.query('SELECT balance FROM accounts WHERE id = ?', [account_id]);
      const balanceAfter = accountRows[0]?.balance || 0;

      // Get contact information if contact_id exists
      let contactName = null;
      let contactType = null;
      if (contact_id) {
        const [contactRows] = await connection.query('SELECT contact_name, type FROM contacts WHERE id = ?', [contact_id]);
        if (contactRows.length > 0) {
          contactName = contactRows[0].contact_name;
          contactType = contactRows[0].type;
        }
      }

      // 2.6: Insert account history record (DEBIT - money subtracted)
      const historyQuery = `
        INSERT INTO account_history 
        (account_id, transaction_type, amount, contact_id, contact_name, contact_type, 
         date, description, reference, payment_id, balance_after, user_id) 
        VALUES (?, 'DEBIT', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await connection.query(historyQuery, [
        account_id,
        amount,
        contact_id || null,
        contactName,
        contactType,
        date,
        description || null,
        reference || null,
        paymentResult.insertId,
        balanceAfter,
        user_id || null
      ]);

      // 3. Update the supplier's total_amount if contact_id exists
      if (contact_id) {
        const updateSupplierQuery = 'UPDATE supplier_details SET total_amount = total_amount - ? WHERE contact_id = ?';
        await connection.query(updateSupplierQuery, [amount, contact_id]);

        // If payment account is NO_1 or NO_2, deduct from supplier_details.no_1 or no_2
        if (account_id) {
          const [accountRows] = await connection.query(
            'SELECT account_name FROM accounts WHERE id = ? LIMIT 1',
            [account_id]
          );
          if (accountRows.length > 0) {
            const accountName = accountRows[0].account_name;
            if (accountName === 'NO_1') {
              await connection.query(
                'UPDATE supplier_details SET no_1 = COALESCE(no_1, 0) - ? WHERE contact_id = ?',
                [amount, contact_id]
              );
            } else if (accountName === 'NO_2') {
              await connection.query(
                'UPDATE supplier_details SET no_2 = COALESCE(no_2, 0) - ? WHERE contact_id = ?',
                [amount, contact_id]
              );
            }
          }
        }
      }

      // 4. FIFO: Settle Supplier Opening Due first, then oldest purchase invoices
      if (contact_id) {
        // Get supplier code from contacts
        const [supplierRows] = await connection.query('SELECT code FROM contacts WHERE id = ?', [contact_id]);
        if (supplierRows.length > 0) {
          const supplierCode = supplierRows[0].code;

          // Get supplier total balance before this payment (step 3 already subtracted amount)
          const [suppDetailRows] = await connection.query('SELECT total_amount FROM supplier_details WHERE contact_id = ?', [contact_id]);
          const currentTotal = parseFloat(suppDetailRows[0]?.total_amount) || 0;
          const previousTotal = currentTotal + parseFloat(amount);

          // Get total unpaid PIs
          const [piSumRows] = await connection.query(
            'SELECT COALESCE(SUM(balance_due), 0) AS total_pi_due FROM purchase_invoices WHERE user = ? AND balance_due > 0',
            [supplierCode]
          );
          const totalPIDue = parseFloat(piSumRows[0]?.total_pi_due) || 0;

          // Unsettled opening due
          const unsettledOpeningDue = Math.max(0, previousTotal - totalPIDue);
          let remainingPayment = parseFloat(amount);

          // 1. Settle supplier opening due first
          if (unsettledOpeningDue > 0) {
            const openingSettled = Math.min(remainingPayment, unsettledOpeningDue);
            remainingPayment -= openingSettled;
          }

          // 2. Settle oldest purchase invoices with remaining payment
          if (remainingPayment > 0) {
            const [unpaidPIs] = await connection.query(
              'SELECT id, balance_due FROM purchase_invoices WHERE user = ? AND balance_due > 0 ORDER BY id ASC FOR UPDATE',
              [supplierCode]
            );
            for (const pi of unpaidPIs) {
              if (remainingPayment <= 0) break;
              const piBalance = parseFloat(pi.balance_due);
              const deduction = Math.min(remainingPayment, piBalance);
              await connection.query(
                'UPDATE purchase_invoices SET balance_due = balance_due - ? WHERE id = ?',
                [deduction, pi.id]
              );
              remainingPayment -= deduction;
            }
          }
        }
      }

      await connection.commit();
      return { id: paymentResult.insertId, ...paymentData };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM payments');
    return rows;
  },
  update: async (id, updateData) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Build SET part dynamically for update fields
      const fields = [];
      const values = [];
      for (const [key, value] of Object.entries(updateData)) {
        if (key !== 'id' && value !== undefined) {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      }
      values.push(id);

      const updateQuery = `UPDATE payments SET ${fields.join(', ')} WHERE id = ?`;
      await connection.query(updateQuery, values);

      const [rows] = await connection.query('SELECT * FROM payments WHERE id = ?', [id]);
      await connection.commit();

      return rows[0];
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  delete: async (id) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query('DELETE FROM payments WHERE id = ?', [id]);

      await connection.commit();
      return result.affectedRows;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Delete all payments
  deleteAll: async () => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Get count before deleting
      const [countResult] = await connection.query('SELECT COUNT(*) as count FROM payments');
      const count = countResult[0].count;

      // Delete all payments
      await connection.query('DELETE FROM payments');

      await connection.commit();
      return { deletedCount: count };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  deleteByContactId: async (contactId) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [contactRows] = await connection.query(
        'SELECT code FROM contacts WHERE id = ? LIMIT 1',
        [contactId]
      );
      const contactCode = contactRows.length > 0 ? contactRows[0].code : null;

      const [paymentCountResult] = await connection.query(
        'SELECT COUNT(*) as count FROM payments WHERE contact_id = ?',
        [contactId]
      );
      const deletedPayments = paymentCountResult[0].count;

      let deletedPurchaseInvoices = 0;
      if (contactCode) {
        const [purchaseCountResult] = await connection.query(
          'SELECT COUNT(*) as count FROM purchase_invoices WHERE user = ? OR code_user = ?',
          [contactCode, contactCode]
        );
        deletedPurchaseInvoices = purchaseCountResult[0].count;
      }

      await connection.query('DELETE FROM payments WHERE contact_id = ?', [contactId]);

      if (contactCode) {
        await connection.query(
          'DELETE FROM purchase_invoices WHERE user = ? OR code_user = ?',
          [contactCode, contactCode]
        );
      }

      await connection.commit();
      return {
        deletedCount: deletedPayments,
        deletedPayments,
        deletedPurchaseInvoices,
        contactCode
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Paginated search with multi-term support
  findAllPaginated: async ({ page = 1, limit = 10, search = '' }) => {
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];

    if (search && search.trim()) {
      const terms = search.trim().split(/\s+/).filter(t => t.length > 0);
      if (terms.length > 0) {
        const searchFields = [
          'p.description', 'p.reference', 'p.note', 'p.amount',
          'c.contact_name', 'c.code', 'a.account_name',
          "DATE_FORMAT(p.date, '%d-%m-%Y')",
          "DATE_FORMAT(p.date, '%d-%m-%y')",
          "DATE_FORMAT(p.date, '%d/%m/%Y')",
          "DATE_FORMAT(p.date, '%d/%m/%y')",
          "DATE_FORMAT(p.date, '%Y-%m-%d')",
          "DATE_FORMAT(p.date, '%d-%m')",
          "DATE_FORMAT(p.date, '%d/%m')",
          "CAST(p.date AS CHAR)",
          "CAST(p.amount AS CHAR)",
          "CAST(p.id AS CHAR)"
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

    const countQuery = `
      SELECT COUNT(*) as total 
      FROM payments p
      LEFT JOIN contacts c ON p.contact_id = c.id
      LEFT JOIN accounts a ON p.account_id = a.id
      ${whereClause}
    `;
    const [countResult] = await db.query(countQuery, queryParams);
    const total = countResult[0].total;

    const dataQuery = `
      SELECT p.*, c.contact_name, c.code as contact_code, a.account_name
      FROM payments p
      LEFT JOIN contacts c ON p.contact_id = c.id
      LEFT JOIN accounts a ON p.account_id = a.id
      ${whereClause}
      ORDER BY p.id DESC
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
module.exports = Payment;