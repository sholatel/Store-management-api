import mongoose, { Document, Schema } from 'mongoose';
import { IStore } from '../interfaces/store.interface';

const storeSchema = new Schema<IStore>({
  name: { type: String, required: true },
  st_location: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

export default mongoose.model<IStore>('Store', storeSchema);