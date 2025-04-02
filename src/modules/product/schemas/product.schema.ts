import mongoose, { Document, Schema } from 'mongoose';
import { IProduct } from '../interfaces/product.interface';

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });



export default  mongoose.model<IProduct>('Product', productSchema);