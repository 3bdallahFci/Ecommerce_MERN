import dotenv from "dotenv";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import mongoose, { Document, Schema, type ObjectId } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
// import userRoute from "../src/routes/userRoute.js";

dotenv.config();
const app = express();
const port = 3001;
app.use(express.json());
app.use(cors());

// JWT middleware

export interface ExtendRequest extends Request {
  user?: any;
  admin?: any;
}

export const validateJWT = (
  req: ExtendRequest,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.get("authorization");
  if (!authorizationHeader) {
    return res.send("authorization header not found").status(403);
  }

  const token = authorizationHeader.split(" ")[1];

  if (!token) {
    return res.send("Bearer token not found").status(403);
  }

  jwt.verify(token, process.env.JWT_KEY || "", async (err, payload) => {
    if (err) {
      return res.send("invalid token").status(403);
    }

    if (!payload) {
      return res.send("Invalid token payload").status(403);
    }

    const userPayload = payload as {
      email: string;
      firstName: string;
      lastName: string;
    };

    const user = await userModel.findOne({ email: userPayload.email });
    req.user = user;
    next();
  });
};

// app.use('/user', userRoute)
mongoose
  .connect(process.env.MONGO_URL || ``)
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
  try {
    const findUser = await userModel.findOne({ email });
    if (findUser) {
      return { data: "User already exists", statusCode: 400 };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    await newUser.save();
    const jwtToken = jwtGenerate({ firstName, email, lastName });
    return { data: jwtToken, statusCode: 200 };
  } catch (error) {
    return { data: `Registration failed : ${error}`, statusCode: 500 };
  }
};

interface loginparams {
  email: string;
  password: string;
}

const login = async ({ email, password }: loginparams) => {
  try {
    const findUser = await userModel.findOne({ email });
    if (!findUser) {
      return { data: "Incorrect email or password", statusCode: 400 };
    }
    const passwordMatch = await bcrypt.compare(password, findUser.password);
    if (passwordMatch) {
      const jwtToken = jwtGenerate({
        email,
        firstName: findUser.firstName,
        lastName: findUser.lastName,
      });
      return { data: jwtToken, statusCode: 200 };
    }
    return { data: "Incorrect email or password", statusCode: 400 };
  } catch (error) {
    return { data: "Login failed", statusCode: 500 };
  }
};
// admin database steup

export interface IAdmin {
  username: string;
  email: string;
  password: string;
}

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const adminModel = mongoose.model<IAdmin>("admin", adminSchema);

// JWT generation
const jwtGenerate = (data: any) => {
  return jwt.sign(data, process.env.JWT_KEY || ``);
};

// users endpoints ----------------------------------------

app.post("/user/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log(password);
  const { statusCode, data } = await register({
    firstName,
    lastName,
    email,
    password,
  });

  res.status(statusCode).json(data);
});

app.post("/user/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, statusCode } = await login({ email, password });

  res.status(statusCode).json(data);
});

// handling products section

// products database setup

interface Iproduct extends Document {
  title: string;
  image: string;
  stock: number;
  price: number;
}

const productSchema = new Schema<Iproduct>({
  title: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
});

const productModel = mongoose.model<Iproduct>("products", productSchema);

// products services

export const getAllProducts = async () => {
  try {
    return await productModel.find();
  } catch (error) {
    return [];
  }
};

const seedInitialProducts = async () => {
  try {
    const products = [
      {
        title: "HP VICTUS 15",
        image:
          "https://egyptlaptop.com/images/detailed/68/Hp-Victus-15-fa1051ne-Gaming-Laptop.webp",
        price: 2000,
        stock: 10,
      },
      {
        title: "iphone 12 pro max",
        image:
          "https://cdn.shortpixel.ai/spai/q_glossy+ret_img+to_webp/mobizil.com/wp-content/uploads/2020/10/Apple-iPhone-12-Pro-Max.jpg",
        price: 2000,
        stock: 10,
      },
      {
        title: "Mouse Gaming",
        image:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS59EH7599Q8a2wSKEv61w2jBYYXMl5S_6-10GTHF6Cx-RWEh099kCNyh1fzvUA4vHnF81FfcSXgNkY4V2a2nylAeA8aGH-ixy3cAqHrka3etyqXOF7m0-rWYkFJ9hXOOVjQvr9yOs&usqp=CAc",
        price: 2000,
        stock: 10,
      },
    ];
    const existingProducts = await getAllProducts();
    if (existingProducts.length === 0) await productModel.insertMany(products);
  } catch (error) {
    // silent fail
  }
};

// seeding products in database for one time only
seedInitialProducts();

// products router handlers

app.get("/product", async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).send(products);
  } catch (error) {
    res.send({ Error: error }).status(400);
  }
});

// add products by admin dashboard
// app.post("/product",validateJWT)

// handling cart feature

// cart database setup

const statusEnum = ["active", "completed"];

interface IcartItem {
  product: Iproduct;
  unitPrice: number;
  quantity: number;
}

interface Icart extends Document {
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

const cartModel = mongoose.model("carts", cartSchema);

// Cart services ----------------------------------

interface createCartForUser {
  userId: string;
}

const createCartForUser = async ({ userId }: createCartForUser) => {
  try {
    const cart = await cartModel.create({ userId, totalAmount: 0 });
    await cart.save();
    return cart;
  } catch (error) {
    return null;
  }
};

interface getActiveCartForUser {
  userId: string;
  populateProduct?: boolean;
}

const getActiveCartForUser = async ({
  userId,
  populateProduct,
}: getActiveCartForUser) => {
  try {
    let cart;
    if (populateProduct) {
      cart = await cartModel
        .findOne({
          userId,
          status: "active",
        })
        .populate("items.product");
    } else {
      cart = await cartModel.findOne({
        userId,
        status: "active",
      });
    }
    if (!cart) {
      cart = await createCartForUser({ userId });
    }
    return cart;
  } catch (error) {
    return null;
  }
};

interface addItemtoCart {
  userId: string;
  quantity: number;
  productId: any;
}

const addItemtoCart = async ({
  userId,
  productId,
  quantity,
}: addItemtoCart) => {
  try {
    const cart = await getActiveCartForUser({ userId });
    if (!cart) return { data: "Cart not found", statusCode: 500 };
    const existInCart = cart.items.find(
      (p) => p.product.toString() === productId
    );
    if (existInCart) {
      return { data: "Item already exists in cart", statusCode: 400 };
    }
    const product = await productModel.findById(productId);
    if (!product) {
      return { data: "product Not Found", statusCode: 400 };
    }
    if (product.stock < quantity) {
      return { data: "Product is Out Of Stock", statusCode: 400 };
    }
    cart.items.push({
      product: productId,
      unitPrice: product.price,
      quantity,
    });
    cart.totalAmount += product.price * quantity;
    await cart.save();
    return {
      data: await getActiveCartForUser({ userId, populateProduct: true }),
      statusCode: 201,
    };
  } catch (error) {
    return { data: "Failed to add item to cart", statusCode: 500 };
  }
};

interface updateItemsInCart {
  userId: string;
  quantity: number;
  productId: any;
}

const updateItemsInCart = async ({
  productId,
  quantity,
  userId,
}: updateItemsInCart) => {
  try {
    const cart = await getActiveCartForUser({ userId });
    if (!cart) return { data: "Cart not found", statusCode: 500 };
    const existInCart = cart.items.find(
      (p) => p.product.toString() === productId
    );
    if (!existInCart) {
      return { data: "product Not Found in the cart", statusCode: 400 };
    }
    existInCart.quantity = quantity;
    const product = await productModel.findById(productId);
    if (!product) {
      return { data: "product Not Found", statusCode: 400 };
    }
    if (product.stock < quantity) {
      return { data: "Product is Out Of Stock", statusCode: 400 };
    }
    cart.totalAmount = cart.items.reduce(
      (sum, i) => sum + i.unitPrice * i.quantity,
      0
    );
    await cart.save();
    return {
      data: await getActiveCartForUser({ userId, populateProduct: true }),
      statusCode: 201,
    };
  } catch (error) {
    return { data: "Failed to update cart", statusCode: 500 };
  }
};

interface deleteItemFromCart {
  userId: string;
  productId: any;
}

const deleteItemFromCart = async ({
  userId,
  productId,
}: deleteItemFromCart) => {
  try {
    const cart = await getActiveCartForUser({ userId });
    if (!cart) return { data: "Cart not found", statusCode: 500 };
    const existInCart = cart.items.find(
      (p) => p.product.toString() === productId
    );
    if (!existInCart) {
      return { data: "product Not Found in the cart", statusCode: 400 };
    }
    cart.items = cart.items.filter((p) => p.product.toString() !== productId);
    cart.totalAmount = cart.items.reduce(
      (sum, i) => sum + i.unitPrice * i.quantity,
      0
    );
    await cart.save();
    return {
      data: await getActiveCartForUser({ userId, populateProduct: true }),
      statusCode: 200,
    };
  } catch (error) {
    return { data: "Failed to delete item from cart", statusCode: 500 };
  }
};

interface clearCart {
  userId: string;
}

const clearCart = async ({ userId }: clearCart) => {
  try {
    const cart = await getActiveCartForUser({ userId });
    if (!cart) return { data: "Cart not found", statusCode: 500 };
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();
    return {
      data: await getActiveCartForUser({ userId, populateProduct: true }),
      statusCode: 200,
    };
  } catch (error) {
    return { data: "Failed to clear cart", statusCode: 500 };
  }
};
// cart route handlers -------------------------------------

app.get("/cart", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req.user._id;
    const cart = await getActiveCartForUser({
      userId,
      populateProduct: true,
    });
    res.status(200).send(cart);
  } catch (error) {
    res.status(400).send({ Error: error });
  }
});

app.post("/cart/item", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    const data = await addItemtoCart({ userId, productId, quantity });
    res.status(data.statusCode).send(data.data);
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
});
app.put("/cart/item", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    const data = await updateItemsInCart({ userId, productId, quantity });
    res.status(data.statusCode).send(data.data);
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
});

app.delete("/item/:productId", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const data = await deleteItemFromCart({ userId, productId });
    res.status(data.statusCode).send(data.data);
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
});

app.delete("/cart", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req.user._id;
    const data = await clearCart({ userId });
    res.status(data.statusCode).send(data.data);
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
});

// orders database setup

interface IorderItem {
  productTitle: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
}

interface Iorder extends Document {
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

// order services ------------------------------------------------

interface checkout {
  userId: string;
  address: string;
}

const checkout = async ({ userId, address }: checkout) => {
  try {
    const cart = await getActiveCartForUser({ userId });
    if (!cart) return { data: "Cart not found", statusCode: 500 };
    const orderItems = [];
    for (const item of cart.items) {
      const product = await productModel.findById(item.product);
      if (!product) {
        return {
          data: "Product not found to complete checkout",
          statusCode: 400,
        };
      }
      const orderItem: IorderItem = {
        productTitle: product?.title,
        productImage: product?.image,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
      };
      orderItems.push(orderItem);
    }
    const order = await orderModel.create({
      orderItems,
      total: cart.totalAmount,
      address,
      userId,
    });
    await order.save();
    cart.status = "completed";
    await cart.save();
    return { data: order, statusCode: 200 };
  } catch (error) {
    return { data: "Checkout failed", statusCode: 500 };
  }
};

// order route handlers -------------------------------------

app.post("/checkout", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req.user._id;
    const { address } = req.body;
    const data = await checkout({ userId, address });
    res.status(data.statusCode).send(data.data);
  } catch (error) {
    res.status(400).send({ Error: error });
  }
});

interface AdminJwtPayload extends jwt.JwtPayload {
  id: string;
  role: string;
}

export const validateAdmin = async (
  req: ExtendRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1️⃣ Get token from headers
    const authHeader = req.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Access denied, no token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied, no token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_kEY || ""
    ) as AdminJwtPayload;

    // 3️⃣ Check if admin still exists
    const admin = await adminModel.findById(decoded.id);
    if (!admin) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // 4️⃣ Attach admin info to request for next middleware
    req.admin = admin;
    next();
  } catch (error) {
    console.error("Admin verification failed:", error);
    res.status(403).json({ message: "Token verification failed" });
  }
};

app.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await adminModel.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare entered password with hashed one
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token for admin
    const token = jwt.sign({ id: admin._id }, process.env.JWT_KEY || "");

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/product", validateAdmin, async (req, res) => {
  try {
    const { title, image, price, stock } = req.body;

    if (!title || !price || !stock || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = new productModel({
      title,
      stock,
      price,
      image,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ message: "Server error while adding product" });
  }
});
app.listen(port, () => {
  console.log(`server is running at: http://localhost:${port}`);
});
