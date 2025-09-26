import dotenv from "dotenv"
import express from "express";
import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
// import userRoute from "../src/routes/userRoute.js";

dotenv.config()
const app = express();
const port = 3001;
app.use(express.json());

// app.use('/user', userRoute)
mongoose
  .connect(process.env.MONGO_URL||``)
  .then(() => console.log("mongo connected"))
  .catch((err) => console.log("failed to connect", err));

// users database setup -------------------------------------

interface Iuser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const userSchema = new Schema<Iuser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const userModel = mongoose.model("users", userSchema);

// users services ---------------------------------------

interface registerParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
const register = async ({
  firstName,
  lastName,
  password,
  email,
}: registerParams) => {
  const findUser = await userModel.findOne({ email });

  if (findUser) {
    return { data: "User already exists", statusCode: 400 };
  }
  
  const hashedPassword = await bcrypt.hash(password,10)

  const newUser = new userModel({ email, password:hashedPassword, firstName, lastName });

  await newUser.save();

  const jwtToken = jwtGenerate({firstName,email,lastName}) 
  
  return { data: jwtToken, statusCode: 200 };
};

interface loginparams {
  email: string;
  password: string;
}

const login = async ({ email, password }: loginparams) => {
  const findUser = await userModel.findOne({ email });

  if (!findUser) {
    return { data: "Incorrect email or password", statusCode: 400 };
  }

  const passwordMatch = await bcrypt.compare(password,findUser.password);
  if (passwordMatch) {
    const jwtToken = jwtGenerate({email,firstName:findUser.firstName,lastName:findUser.lastName})
    return { data: jwtToken, statusCode: 200 };
  }


  return { data: "Incorrect email or password", statusCode: 400 };
};

// JWT generation 
const jwtGenerate = (data:any) => {
  return jwt.sign(data,process.env.JWT_KEY||``)
}

// users endpoints ----------------------------------------

app.post("/user/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const { statusCode, data } = await register({
    firstName,
    lastName,
    email,
    password,
  });

  res.status(statusCode).send(data);
});

app.post("/user/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, statusCode } = await login({ email, password });

  res.status(statusCode).send(data);
});



// handling products section


// products database setup

interface Iproduct extends Document{
    title:string,
    image:string,
    stock:number,
    price:number
}


const productSchema = new Schema<Iproduct>({
    title:{type:String , required: true},
    image:{type:String , required: true},
    price:{type:Number , required: true},
    stock:{type:Number , required: true}
})


const productModel = mongoose.model<Iproduct>("products",productSchema);


// products services

const getAllProducts = async() => {
  return await productModel.find()
}

const seedInitialProducts = async() => {
  const products = [{title:"Mouse Gaming",image:"https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS59EH7599Q8a2wSKEv61w2jBYYXMl5S_6-10GTHF6Cx-RWEh099kCNyh1fzvUA4vHnF81FfcSXgNkY4V2a2nylAeA8aGH-ixy3cAqHrka3etyqXOF7m0-rWYkFJ9hXOOVjQvr9yOs&usqp=CAc",price:2000,stock:10}]

  const existingProducts = await getAllProducts();
  if(existingProducts.length === 0)
    await productModel.insertMany(products)
};

// seeding products in database for one time only
seedInitialProducts()



// products router handlers

app.get("/product",async(req,res) => {

  try {
    const products = await getAllProducts()
    res.status(200).send(products)
  } catch (error) {
    res.send({"Error" : error}).status(400)
  }
})


app.listen(port, () => {
  console.log(`server is running at: http://localhost:${port}`);
});
