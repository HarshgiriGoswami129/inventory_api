const db = require('../config/db');

const Contact = {
  // --- REWRITTEN create function ---
  create: async (contactData) => {
    const { type, ...baseData } = contactData;
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Create the base contact record
      const { contact_name, code, email, image_url, address, created_by } = baseData;
      const contactQuery = 'INSERT INTO contacts (contact_name, type, code, email, image_url, address, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const [result] = await connection.query(contactQuery, [contact_name, type, code, email, image_url, address, created_by]);
      const contactId = result.insertId;

      // 2. Based on the type, insert into the correct details table
      if (type === 'Customer') {
        const { credit_period, billing_address, delivery_address, gstin, pan, place_of_supply, reverse_charge, type_of_registration } = baseData.details;
        const customerQuery = 'INSERT INTO customer_details (contact_id, credit_period, billing_address, delivery_address, gstin, pan, place_of_supply, reverse_charge, type_of_registration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        await connection.query(customerQuery, [contactId, credit_period, billing_address, delivery_address, gstin, pan, place_of_supply, reverse_charge, type_of_registration]);
      } else if (type === 'Supplier') {
        const { credit_limit, division, due_date, payment_status, note } = baseData.details;
        const supplierQuery = 'INSERT INTO supplier_details (contact_id, credit_limit, division, due_date, payment_status, note) VALUES (?, ?, ?, ?, ?, ?)';
        await connection.query(supplierQuery, [contactId, credit_limit, division, due_date, payment_status, note]);
      }

      await connection.commit();
      return { id: contactId, ...contactData };

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // --- REWRITTEN findAll function ---
  findAll: async () => {
    // This query joins the base contact info with specific details from both customer and supplier tables
    const query = `
      SELECT 
        c.*,
        cd.credit_period, cd.billing_address, cd.delivery_address, cd.gstin, cd.pan, cd.place_of_supply, cd.reverse_charge, cd.type_of_registration,
        sd.credit_limit, sd.division, sd.due_date, sd.payment_status, sd.note
      FROM contacts c
      LEFT JOIN customer_details cd ON c.id = cd.contact_id
      LEFT JOIN supplier_details sd ON c.id = sd.contact_id
    `;
    const [rows] = await db.query(query);
    return rows;
  }
  // You would add findById, update, and delete functions here as well
};

module.exports = Contact;