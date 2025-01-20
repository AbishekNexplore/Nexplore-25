require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        status: 'Server is running',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

app.get('/api', (req, res) => {
    res.json({ 
        status: 'API is running',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Test MongoDB connection
const testMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/career-navigator', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✓ MongoDB connected successfully');
        
        // Test the connection by listing collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));
        
    } catch (err) {
        console.error('✗ MongoDB connection error:', err);
        process.exit(1);
    }
};

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/resume', require('./routes/resume'));  

// TODO: These routes will be implemented later
// app.use('/api/recommendations', require('./routes/recommendations'));
// app.use('/api/progress', require('./routes/progress'));
// app.use('/api/trends', require('./routes/trends'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    console.error('Stack:', err.stack);
    res.status(500).json({ error: 'Something broke!', details: err.message });
});

// Handle 404 errors
app.use((req, res) => {
    console.log('404 Not Found:', req.method, req.url);
    res.status(404).json({ error: 'Not Found' });
});

const PORT = process.env.PORT || 5000;

// Start server and test MongoDB
const startServer = async () => {
    await testMongoDB();
    
    const server = app.listen(PORT, () => {
        console.log('\nServer Status:');
        console.log('✓ Server is running on port', PORT);
        console.log(`✓ Test the server at: http://localhost:${PORT}`);
        console.log(`✓ API endpoint at: http://localhost:${PORT}/api`);
        console.log(`✓ Auth endpoints at: http://localhost:${PORT}/api/auth/*\n`);
    });
};

startServer().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
