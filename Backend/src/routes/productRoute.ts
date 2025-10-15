import express from "express";
import { getAllProducts } from "../services/productSerives.js";

const router = express.Router();

router.get("/product", async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).send(products);
  } catch (error) {
    res.send({ Error: error }).status(400);
  }
});

export default router;
