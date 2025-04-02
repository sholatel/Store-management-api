import mongoose from "mongoose";
import logger from "../utils/logger";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }
  
    if (process.env.NODE_ENV === 'test') {
      // In test environment, we use MongoMemoryServer
      return;
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    logger(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
