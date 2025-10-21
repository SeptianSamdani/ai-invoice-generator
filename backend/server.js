require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const authRoutes = require('./routes/authRoutes'); 
const invoiceRoutes = require('./routes/invoiceRoutes'); 
const aiRoutes = require('./routes/aiRoutes');

const app = express();

const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://yourdomain.com'] 
  : ['http://localhost:5173', 'http://localhost:3000'];

// Middleware to handle CORS
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));

// connect to database
connectDB();

// Middleware 
app.use(express.json());

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Define routes
app.use('/api/auth', authRoutes, limiter); 
app.use('/api/invoices', invoiceRoutes, limiter); 
app.use('/api/ai', aiRoutes, limiter);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));