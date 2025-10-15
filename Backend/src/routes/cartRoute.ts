import express from "express";
import {
  addItemtoCart,
  updateItemsInCart,
  deleteItemFromCart,
  clearCart,
  getActiveCartForUser,
} from "../services/cartServices.js";
import { validateJWT, type ExtendRequest } from "../index.js";

const router = express.Router();

router.get("/cart", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req.user._id;
    const cart = await getActiveCartForUser({ userId });
    res.status(200).send(cart);
  } catch (error) {
    res.status(400).send({ Error: error });
  }
});

router.post("/cart/item", validateJWT, async (req:ExtendRequest, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    const data = await addItemtoCart({ userId, productId, quantity });
    res.status(data.statusCode).send(data.data);
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
});

router.put("/cart/item", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    const data = await updateItemsInCart({ userId, productId, quantity });
    res.status(data.statusCode).send(data.data);
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
});

router.delete("/item/:productId", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const data = await deleteItemFromCart({ userId, productId });
    res.status(data.statusCode).send(data.data);
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
});

router.delete("/cart", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req.user._id;
    const data = await clearCart({ userId });
    res.status(data.statusCode).send(data.data);
  } catch (error) {
    res.status(400).send("Error: " + error);
  }
});

export default router;
