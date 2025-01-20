import mongoose from 'mongoose';

// Connect to MongoDB : uses DB_URL from environment variables
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit the process if failure occurs 
  }
};

export default connectToDatabase;
