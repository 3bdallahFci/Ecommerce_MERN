import express from "express";
import { checkout } from "../services/orderServices.js";
import { validateJWT, type ExtendRequest } from "../index.js";

const router = express.Router();

router.post("/checkout", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req.user._id;
    const { address } = req.body;
    const data = await checkout({ userId, address });
    res.status(data.statusCode).send(data.data);
  } catch (error) {
    res.status(400).send({ Error: error });
  }
});

export default router;
