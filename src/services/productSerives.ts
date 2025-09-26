import { productModel } from "../models/productModels.js";

const getAllProducts = async() => {
  return await productModel.find()
}

const seedInitialProducts = async() => {
  const products = [{title:"Mouse Gaming",image:"https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS59EH7599Q8a2wSKEv61w2jBYYXMl5S_6-10GTHF6Cx-RWEh099kCNyh1fzvUA4vHnF81FfcSXgNkY4V2a2nylAeA8aGH-ixy3cAqHrka3etyqXOF7m0-rWYkFJ9hXOOVjQvr9yOs&usqp=CAc",price:2000,stock:10}]

  const existingProducts = await getAllProducts();
  if(existingProducts.length === 0)
    await productModel.insertMany(products)
};