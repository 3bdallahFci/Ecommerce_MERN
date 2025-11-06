import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { BASE_URL } from "../constants/BaseUrl";
import {useAdminAuth}  from "../Context/AdminContext";


export default function AdminDashboard() {
  const {logout} = useAdminAuth()
  const [form, setForm] = useState({
    title: "",
    price: "",
    image: "",
    stock: "",
  });

  const handleChange = (e:any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/product`, form, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("adminToken")}`,
          "Content-Type": "application/json"
        },
      });
      alert("✅ Product added successfully!");
      setForm({ title: "", price: "", image: "", stock: "" });
    } catch (err) {
      alert("❌ Failed to add product");
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          mt: 6,
          borderRadius: 3,
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          fontWeight="bold"
          sx={{ color: "primary.main" }}
        >
          <AddCircleIcon sx={{ mr: 1, color: "primary.main" }} />
          Add New Product
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          {/* Product Title (Full width) */}
          <TextField
            label="Product Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            sx={{ gridColumn: "1 / -1" }}
          />

          {/* Price */}
          <TextField
            label="Price"
            name="price"
            type="number"
            sx={{ gridColumn: "1 / -1" }}
            value={form.price}
            onChange={handleChange}
            required
          />

          
          {/* Image URL (Full width) */}
          <TextField
            label="Image URL"
            name="image"
            value={form.image}
            onChange={handleChange}
            sx={{ gridColumn: "1 / -1" }}
          />

          {/* Description (Full width, multiline) */}
          <TextField
            label="Stock"
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            sx={{ gridColumn: "1 / -1" }}
          />

          {/* Submit Button (Full width) */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              gridColumn: "1 / -1",
              mt: 1,
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "1rem",
              py: 1.2,
              borderRadius: 2,
            }}
          >
            Add Product
          </Button>
        </Box>
      </Paper>
      <Button variant="contained" sx={{mt: 3}} fullWidth onClick={() => logout()}>Logout</Button>
    </Container>
  );
}
