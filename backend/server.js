const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
// Health check route
app.get('/', (req, res) => {
    res.send('API is running successfully...');
});

// Database Connection and Server Sync
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL Connected... ✅');

        // Sync models
        await sequelize.sync({ alter: true });
        console.log('Database Synced... 📊');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
    }
};

startServer();