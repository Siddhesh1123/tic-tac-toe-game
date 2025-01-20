import express from 'express';
import { registerUser, loginUser, updateProfile } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Register User : Public route to create a new user
router.post('/register', registerUser);

// Login User : Public route to authenticate user and return token
router.post('/login', loginUser);

// Update User Profile : Protected route, requires JWT token
router.put('/profile', protect, updateProfile);

export default router;
