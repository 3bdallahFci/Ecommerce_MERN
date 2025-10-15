import mongoose, { Document, Schema,type ObjectId } from "mongoose";

export interface IorderItem {
  productTitle: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
}

export interface Iorder extends Document {
  orderItems: IorderItem[];
  total: number;
  address: string;
  userId: ObjectId | string;
}

const orderItemSchema = new Schema<IorderItem>({
  productTitle: { type: String, required: true },
  productImage: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const orderSchema = new Schema<Iorder>({
  orderItems: [orderItemSchema],
  total: { type: Number, required: true },
  address: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
});

const orderModel = mongoose.model<Iorder>("orders", orderSchema);
export default orderModel;
