require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const authRoutes = require('./routes/authRoutes'); 
const invoiceRoutes = require('./routes/invoiceRoutes'); 

const app = express();

// Middleware to handle CORS
app.use(cors(
    {
        origin: "*", 
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }
));

// connect to database
connectDB();

// Middleware 
app.use(express.json());

// Define routes
app.use('/api/auth', authRoutes); 
app.use('/api/invoices', invoiceRoutes); 

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));