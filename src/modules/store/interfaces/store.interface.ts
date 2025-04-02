import mongoose from "mongoose";

export interface IStore extends Document {
    name: string;
    st_location: string;
    owner: mongoose.Types.ObjectId;
    products: mongoose.Types.ObjectId[];
}
  