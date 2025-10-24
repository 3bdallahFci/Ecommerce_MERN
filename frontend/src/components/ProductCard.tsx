import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";
import { useCart } from "../Context/CartContext";

interface props {
  _id: string;
  title: string;
  price: number;
  image: string;
}

export default function ProductCard({ _id, title, price, image }: props) {
  const { addToCart } = useCart();
  return (
    <Container sx={{ width: "70%" }}>
      <Card>
        <CardMedia
          component="img"
          alt="green iguana"
          height="400"
          width="400"
          image={image}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {price} EGP
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="large"
            variant="contained"
            fullWidth
            onClick={() => addToCart(_id)}
          >
            Add To Cart
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
}
