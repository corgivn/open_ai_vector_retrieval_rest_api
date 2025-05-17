// src/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const { processVectorQuery } = require('./vector-demo');
require('dotenv').config();

// Configuration
const config = {
    port: process.env.PORT || 3000,
    defaultFilePath: process.env.DEFAULT_FILE_PATH || '/Users/roger/Documents/my_projects/open_ai_vector_retrieval_rest_api/test_data.json',
    apiPrefix: process.env.API_PREFIX || '/api'
};

// Create Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(express.static('public')); // Serve static files from public directory

// Health check endpoint
app.get(`${config.apiPrefix}/health`, (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Vector Retrieval API is running',
        version: '1.0.0'
    });
});

// Vector retrieval API endpoint
app.post(`${config.apiPrefix}/retrieve`, async (req, res) => {
    try {
        const { query, filePath } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        // Use the provided file path, or the default from config
        const FILE_PATH = filePath || config.defaultFilePath;

        console.log(`Received query: "${query}"`);
        console.log('Processing request...');

        const { answer, chunks } = await processVectorQuery(query, FILE_PATH);

        return res.status(200).json({
            answer,
            chunks,
            query
        });
    } catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unexpected error:', err);
    res.status(500).json({
        error: 'An unexpected error occurred',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Not found', message: `Route ${req.method} ${req.path} not found` });
});

// Start the server
const server = app.listen(config.port, () => {
    console.log(`OpenAI Vector Retrieval API Server running on port ${config.port}`);
    console.log('Available endpoints:');
    console.log(`- GET http://localhost:${config.port}${config.apiPrefix}/health`);
    console.log(`- POST http://localhost:${config.port}${config.apiPrefix}/retrieve`);
    console.log(`- GET http://localhost:${config.port}/ (Web UI)`);
    console.log('\nExample POST request body:');
    console.log('{\n  "query": "What is artificial intelligence?"\n}');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});
