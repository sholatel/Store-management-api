import mongoose from "mongoose";

export interface IProduct extends Document {
    name: string;
    price: number;
    description: string;
    store: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
  }
  