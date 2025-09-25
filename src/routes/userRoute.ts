import express from "express";
import { register } from "../services/userServices.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const { statusCode, data } = await register({
    firstName,
    lastName,
    email,
    password,
  });
  res.status(statusCode).send(data);
});


router.post("/login",(req,res) =>{

    
})

export default router;
