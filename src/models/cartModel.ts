import mongoose, { Document, Schema, type ObjectId } from "mongoose";
import type { Iproduct } from "./productModels.js";

const statusEnum = ["active", "completed"];

interface IcartItem {
  product: Iproduct;
  unitPrice: number;
  quantity: number;
}

export interface Icart extends Document {
  userId: ObjectId | string;
  items: IcartItem[];
  totalAmount: number;
  status: "active" | "completed";
}

const cartItemSchema = new Schema<IcartItem>({
  product: { type: Schema.Types.ObjectId, required: true, ref: "products" },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const cartSchema = new Schema<Icart>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "users" },
  items: [cartItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "active", enum: statusEnum },
});

export const cartModel = mongoose.model("carts", cartSchema);







