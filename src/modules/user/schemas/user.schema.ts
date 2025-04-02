import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../interfaces/user.interface';
import dotenv from "dotenv";

dotenv.config();

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user'], default: 'user' },
    isEmailVerified: { type:Boolean, default:false },
    emailVerificationToken: {
      type:String,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // in 24hrs,
      unique: process.env.NODE_ENV === "test" ? false : true
    }
  }, { timestamps: true });


  // Hash password before saving
userSchema.pre<IUser>('save', async function(next) {
    if (!(this as any).isModified('password')) return next();
    
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });
  
  // Method to compare passwords
  userSchema.methods.comparePassword = async function(
    candidatePassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  export  default  mongoose.model<IUser>('User', userSchema);