import mongoose, { Document, Schema,type ObjectId } from "mongoose";


export interface IAdmin {
  username: string;
  email: string;
  password:string;
}


const adminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const adminModel = mongoose.model<IAdmin>("admin", adminSchema);
export default adminModel;
