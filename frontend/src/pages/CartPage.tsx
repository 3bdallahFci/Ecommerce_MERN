import { Box, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { BASE_URL } from "../constants/BaseUrl";
import { useAuth } from "../Context/AuthContext";
import { useCart } from "../Context/CartContext";

const CartPage = () => {
  const { token } = useAuth();
  const [cart, setCart] = useState();
  const [error, setError] = useState<any>();
  const {CartItem,totalamount} = useCart()

  
  return (
    <Container>
      <Typography variant="h4" textAlign={"center"} mt={3}>
        My Cart
      </Typography>
      <Box>{CartItem.map((i) => (<><Typography>{i.title}</Typography>
    <img src={i.productImage}/></>))}</Box>
    </Container>
  );
};

export default CartPage;
