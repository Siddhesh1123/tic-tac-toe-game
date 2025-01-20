import mongoose from 'mongoose';

// Define schema for user accounts
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true, // Username is mandatory
    unique: true,   // Each username must be unique
  },
  password: {
    type: String,
    required: true, // Password is mandatory
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt timestamps
});

// Create and export the User model
const User = mongoose.model('User', userSchema);

export default User;
