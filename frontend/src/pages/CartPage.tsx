import { Box, Button, ButtonGroup, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useCart } from "../Context/CartContext";

const CartPage = () => {
  const { CartItem, totalAmount,updateIteminCart,RemoveIteminCart } = useCart();
  const handlequantity = (productId:string,quantity:number) => {
    if(quantity <= 0) return
    updateIteminCart(productId,quantity)
  }
  const handleRemove = (productId:string) =>
  {
    RemoveIteminCart(productId);
  }
  return (
    <Container fixed sx={{ mt: 2 }}>
      <Typography variant="h3" sx={{textAlign:"center"}}>My Cart</Typography>
      <Box display={"flex"} flexDirection={"column"} gap={4} mt={4}>
        {CartItem.map((i) => (
            <Box
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              sx={{
                border: 1,
                borderColor: "#f2f2f2",
                borderRadius: 5,
                padding: 2,
              }}
            >
              <Box display={"flex"} flexDirection={"row"} alignItems={"center"} gap={2}>
              <img src={i.image} alt="" width={150} />
              <Box>
                <Typography variant="h5">{i.title}</Typography>
                <Typography>
                  {i.quantity} x {i.unitPrice} EGP
                </Typography>
                <Button onClick={() => handleRemove(i.productId)}>Remove item</Button>
              </Box>
            </Box>
            <ButtonGroup variant="contained">
              <Button onClick={() => handlequantity(i.productId,i.quantity + 1)}>+</Button>
              <Button onClick={() => handlequantity(i.productId,i.quantity - 1)}>-</Button>
            </ButtonGroup>
            </Box>
        ))}
        <Box>
          <Typography variant="h4">Total Amount: {totalAmount.toFixed(2)} EGP</Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default CartPage;
