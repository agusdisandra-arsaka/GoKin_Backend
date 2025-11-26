// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/db'); // pastikan file db/db.js ada
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// Routes (pastikan file routes exist)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// Swagger (load swagger.yaml in project root)
try {
  const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (e) {
  console.warn('Swagger doc not found or failed to load:', e.message);
}

// Simple health check
app.get('/', (req, res) => res.send('OK'));

// Optional test route for auth (if your routes don't include it)
app.get('/api/auth/test', (req, res) => res.send('auth test route'));

// Bind port from environment (Render sets PORT)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
