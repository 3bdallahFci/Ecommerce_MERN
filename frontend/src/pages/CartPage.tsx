import { Box, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { BASE_URL } from "../constants/BaseUrl";
import { useAuth } from "../Context/AuthContext";

const CartPage = () => {
  const { token } = useAuth();
  const [cart, setCart] = useState();
  const [error, setError] = useState<any>();

  useEffect(() => {
    if (!token) return;
    const fetchdata = async () => {
      try {
        const response = await fetch(`${BASE_URL}/cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(error || "Failed to fetch cart , please try again!");
        }

        setCart(data);
      } catch (error) {
        setError(error || "Failed to fetch cart , please try again!");
      }
    };

    fetchdata();
  }, [token]);
  return (
    <Container>
      <Typography variant="h4" textAlign={"center"} mt={3}>
        My Cart
      </Typography>
      <Box></Box>
    </Container>
  );
};

export default CartPage;
