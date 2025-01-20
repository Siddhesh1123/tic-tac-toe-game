import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Ensure username is unique
    if (await User.findOne({ username })) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login user and generate JWT token
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate user credentials
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token for session management
    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Update user profile (username)
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;  // Extract user ID from JWT token
    const { username } = req.body;

    // Validate input data
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    // Check if new username is already taken by another user
    const existingUser = await User.findOne({ 
      username, 
      _id: { $ne: userId }  // Ensure it's not the same user
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Update user profile with new username
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username },
      { new: true, select: '-password' }  // Return updated user data without password
    );

    // Handle case where user not found
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({ 
      message: 'Error updating profile', 
      error: error.message 
    });
  }
};

export { registerUser, loginUser, updateProfile };
