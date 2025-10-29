import {
  Box,
  Button,
  ButtonGroup,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../Context/CartContext";
import { useNavigate } from "react-router";

const CheckoutPage = () => {
  const addressRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { CartItem, totalAmount } = useCart();
  return (
    <Container fixed sx={{ mt: 2 }}>
      <Box
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
      >
        <Typography variant="h3">Checkout</Typography>
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        gap={2}
        mt={4}
        sx={{
          border: 1,
          borderColor: "#f2f2f2",
          borderRadius: 5,
          padding: 2,
        }}
      >
        <TextField
          name="address"
          label="delivery address"
          fullWidth
          inputRef={addressRef}
        />
        {CartItem.map((i) => (
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Box
              display={"flex"}
              flexDirection={"row"}
              alignItems={"center"}
              gap={2}
              width={"100%"}
            >
              <img src={i.image} alt="" width={100} />
              <Box
                width={"100%"}
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography variant="h5">{i.title}</Typography>
                <Typography
                  sx={{
                    backgroundColor: "#fff",
                    width: "auto",
                    borderRadius: "10px",
                  }}
                >
                  {i.quantity} x {i.unitPrice} EGP
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
        <Box
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography variant="h4" sx={{ textAlign: "right" }}>
            Total Amount: {totalAmount.toFixed(2)} EGP
          </Typography>
        </Box>
      </Box>
      <Button variant="contained" fullWidth sx={{ mt: 2, mb: 3 }}>
        Pay Now
      </Button>
    </Container>
  );
};

export default CheckoutPage;
