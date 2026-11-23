-- Add jw_qty column to sales_orders table
ALTER TABLE sales_orders ADD COLUMN IF NOT EXISTS jw_qty DECIMAL(12, 3) DEFAULT 0.000 AFTER stock_qty;
