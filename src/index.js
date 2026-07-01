const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const githubRoutes = require('./routes/githubRoutes');

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/profiles', githubRoutes);

// API health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ message: 'GitHub Profile Analyzer API is running!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
