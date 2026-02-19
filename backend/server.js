const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(express.json()); // Parses incoming JSON requests
app.use(cors());         // Allows your React frontend to talk to this API

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.error("Database Connection Error:", err));

// Basic Route for Testing
app.get('/', (req, res) => res.send('API is running...'));

const PORT = process.env.PORT || 5000;

// Import Routes
const authRoutes = require('./routes/authRoutes');

// Use Routes
app.use('/api/auth', authRoutes);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));