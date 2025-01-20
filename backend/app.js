import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
// Load environment variables from a .env file
dotenv.config(); 

const app = express();

// Middleware : Parse incoming JSON requests
app.use(express.json());

// Routes : Authentication and Game APIs
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/games', gameRoutes);

// Connect to the database
connectDB();

 // Use the PORT from environment variables or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
