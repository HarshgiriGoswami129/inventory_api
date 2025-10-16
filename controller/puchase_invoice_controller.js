const PurchaseInvoice = require('../model/purchase_invoice_model');

// Helper function to process invoice items with new calculation logic
const processInvoiceItems = (items = []) => {
  if (!items || !Array.isArray(items)) {
    return [];
  }
  
  return items.map(item => {
    // Ensure input values are treated as numbers
    const no_of_peti = parseFloat(item.no_of_peti) || 0;
    const ret_peti_no = parseFloat(item.ret_peti_no) || 0;

    // 1. Calculate the balance
    const peti_balance = no_of_peti - ret_peti_no;

    // 2. Determine the status based on the balance
    const pati_status = peti_balance === 0 ? 0 : 1;

    // 3. Return a new item object with the calculated fields
    return {
      ...item, // This correctly copies ret_peti_no and peti_Type from the request
      peti_balance: peti_balance,
      pati_status: pati_status,
      // --- FIX: The lines below were duplicating keys already copied by ...item ---
      // ret_peti_no: ret_peti_no, // REMOVED
      // Peti_Type: item.Peti_Type || null // REMOVED
    };
  });
};


const purchaseInvoiceController = {
  addInvoiceWithItems: async (req, res) => {
    try {
      const { line_items, user_code, total_amount, ...invoiceData } = req.body;

      const processedItems = processInvoiceItems(line_items);

      const newInvoice = await PurchaseInvoice.createWithStockUpdate(
        invoiceData,
        processedItems,
        user_code,
        total_amount
      );
      res.status(201).json({ success: true, message: "Invoice created successfully.", data: newInvoice });
    } catch (error) {
      console.error('Error creating invoice:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  getAllInvoicesWithItems: async (req, res) => {
    try {
      const invoices = await PurchaseInvoice.findAll();
      const invoicesWithDetails = await Promise.all(invoices.map(async (invoice) => {
        const items = await PurchaseInvoice.findItemsByInvoiceId(invoice.id);
        // const images = await PurchaseInvoice.findImagesByInvoiceId(invoice.id);
        return { ...invoice, items, /*images*/ };
      }));
      res.status(200).json({ success: true, data: invoicesWithDetails });
    } catch (error) {
      console.error('Error getting all invoices:', error);
      res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },

  updateInvoice: async (req, res) => {
    try {
        // Destructure the new deleted_item_ids array from the request body
        const { id, line_items, deleted_item_ids, ...invoiceData } = req.body;
        
        if (!id) {
            return res.status(400).json({ success: false, message: 'Invoice ID is required for update.' });
        }

        // Process items to add calculated fields before sending to the model
        const processedItems = processInvoiceItems(line_items);
        
        const updatedInvoice = await PurchaseInvoice.updateWithItems(
            id,
            invoiceData,
            processedItems,
            deleted_item_ids // Pass the new array to the model
        );

        res.status(200).json({ success: true, message: 'Invoice updated successfully', data: updatedInvoice });
    } catch (error) {
        console.error('Update Invoice Error:', error);
        res.status(500).json({ success: false, message: 'Failed to update invoice', error: error.message });
    }
},

  deleteInvoice: async (req, res) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Invoice ID is required.' });
      }
      await PurchaseInvoice.deleteInvoice(id);
      res.status(200).json({ success: true, message: 'Invoice deleted successfully' });
    } catch (error) {
      console.error('Error deleting invoice:', error);
      res.status(500).json({ success: false, message: 'Failed to delete invoice', error: error.message });
    }
  },

  getInventoryDetailsByCodeUser: async (req, res) => {
    try {
        const { code_user } = req.body;
        if (!code_user) {
            return res.status(400).json({ success: false, message: 'Item code is required.' });
        }
        const details = await PurchaseInvoice.getDetailsByCodeUser(code_user);
        if (details) {
            res.status(200).json({ success: true, data: details });
        } else {
            res.status(404).json({ success: false, message: 'Item not found.' });
        }
    } catch (error) {
        console.error('Error getting inventory details:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },
  getInvoiceSummaries: async (req, res) => {
    try {
        const summaries = await PurchaseInvoice.findAllWithTotalAmount();
        res.status(200).json({ success: true, data: summaries });
    } catch (error) {
        console.error('Error fetching invoice summaries:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
  },
   getUserCode: async (req, res) => {
    try {
      const { user } = req.body;
      
      if (!user) {
        return res.status(400).json({ 
          success: false, 
          message: 'User parameter is required' 
        });
      }

      const codeUsers = await PurchaseInvoice.findCodeUserByUser(user);
      
      if (codeUsers.length > 0) {
        res.status(200).json({
          success: true,
          data: codeUsers  // Just the array of code_user values
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'User not found in inventory items'
        });
      }
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Server Error', 
        error: error.message 
      });
    }
  },

};

module.exports = purchaseInvoiceController;