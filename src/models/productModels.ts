import mongoose,{Document,Schema} from "mongoose";



interface Iproduct extends Document{
    title:string,
    image:string,
    stock:string,
    price:string
}


const productSchema = new Schema<Iproduct>({
    title:{type:String , required: true},
    image:{type:String , required: true},
    price:{type:String , required: true},
    stock:{type:String , required: true}
})


export const productModel = mongoose.model<Iproduct>("products",productSchema);