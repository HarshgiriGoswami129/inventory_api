require('dotenv').config(); // MUST be the very first line
const express = require('express');
const app = express(); // Import the configured Express application
const db = require('./config/db'); // Import the database pool
const userRoutes = require('./route/user_route');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const accountRoutes = require('./route/account_route');
const contactRoutes = require('./route/contact_route');
const receiptRoutes = require('./route/receipt_route');
const paymentRoutes = require('./route/payment_route');

const PORT = process.env.PORT || 3000;

// An async function to connect to the DB and then start the server
const startServer = async () => {
  try {
    // Test the database connection to ensure it's ready
    const connection = await db.getConnection();
    console.log('Database connected successfully.');
    connection.release(); // Return the connection to the pool

    // If the DB connection is successful, start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1); // Stop the application if the DB connection fails
  }
};

// Run the server
startServer();

app.use('/user',userRoutes);
app.use('/accounts', accountRoutes);
app.use('/contacts', contactRoutes);
app.use('/receipts', receiptRoutes);
app.use('/payments', paymentRoutes);

