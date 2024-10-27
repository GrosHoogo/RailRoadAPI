// Load necessary packages
const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
const connectDB = require('./config');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const trainRoutes = require('./routes/trainRoutes');
const trainstationRoutes = require('./routes/trainstationRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
connectDB();

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/trainstations', trainstationRoutes);
app.use('/api/tickets', ticketRoutes);

// Function to start the server
const startServer = () => {
    const PORT = process.env.PORT || 3000; // Use PORT from .env or default to 3000
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`); // Log the running port
    });
};

// Start the server only if the file is run directly
if (require.main === module) {
    startServer();
}

// Export the app for testing or further usage if needed
module.exports = app; // Change this line to export only the app
