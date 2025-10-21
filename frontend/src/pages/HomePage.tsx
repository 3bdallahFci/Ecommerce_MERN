import { Box, Card, CardContent, Typography } from "@mui/material";
import ProductCard from "../components/ProductCard";
import { use, useEffect, useState } from "react";
import type Product from "../types/product";

const BASE_URL = "http://localhost:3001"

const HomePage = () => {
  const [Products , setProducts] = useState<Product[]>([]);
  const [Error,setError] = useState<boolean>()
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await fetch(`${BASE_URL}/product`);
        const data = await response.json();
        setProducts(data)
      } catch{
        setError(true)
      }
    };
    fetchdata()
  }, []);

  if (Error) {
    return <div>something went wrong , please try again!</div>
  }
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: 2,
      }}
      mt={3}
    >
      {Products.map((p:any)=> (
        <ProductCard {...p}/>
      ))}
    </Box>
  );
};

export default HomePage;
