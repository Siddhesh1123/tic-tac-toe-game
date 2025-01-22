import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors'; // Import CORS
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import gameRoutes from './routes/gameRoutes.js';

import { fetchAllGames } from './controllers/gameController.js';

dotenv.config();

const app = express();

// Middleware: Parse incoming JSON requests
app.use(express.json());
app.use(cookieParser());

// CORS Middleware
app.use(
    cors({
        origin: 'http://localhost:5173', // Allow the frontend origin
        credentials: true, // Allow credentials (optional)
    })
);

// Routes: Authentication and Game APIs
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/games', gameRoutes);
app.use('/active', fetchAllGames);

// Connect to the database
connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
