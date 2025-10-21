import { Container, TextField, Box, Typography, Button } from "@mui/material";
import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { BASE_URL } from "../constants/BaseUrl";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router";

const RegisterPage = () => {
  const [error, setError] = useState<any>();
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { login } = useAuth();

  const navigate = useNavigate()

  const onsubmit = async () => {
    try {
      const firstName = firstNameRef.current?.value;
      const lastName = lastNameRef.current?.value;
      const email = emailRef.current?.value;
      const password = passwordRef.current?.value;


      if (!email || !firstName || !lastName || !password) {
        console.log("check submitted data");
        return
      }

      const response = await fetch(`http://localhost:3001/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const token = await response.json();

      if (!response.ok) {
        throw new Error(token.message || "Registration failed");
      }

      login(email, token);

      navigate("/")
    } catch (err: any) {
      setError(err.message);
    }
  };
  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h4">Register New Account</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            mt: 2,
            p: 2,
            border: 3,
            borderColor: "#cfa4ff",
            width: "auto",
            backgroundColor: "white",
            borderRadius: "10px",
          }}
        >
          <FontAwesomeIcon
            icon={faEnvelope}
            style={{ width: "50px", height: "50px" }}
          />
          <TextField
            inputRef={firstNameRef}
            label="firstName"
            name="firstName"
            fullWidth
          />
          <TextField
            inputRef={lastNameRef}
            label="lastName"
            name="lastName"
            fullWidth
          />
          <TextField inputRef={emailRef} label="email" name="email" fullWidth />
          <TextField
            inputRef={passwordRef}
            label="password"
            name="password"
            fullWidth
          />
          <Button
            variant="contained"
            fullWidth
            onClick={onsubmit}
            sx={{ backgroundColor: "#cfa4ff", borderRadius: "10px" }}
          >
            Register
          </Button>
          {error && (
            <div
              style={{
                backgroundColor: "#fee",
                color: "#c33",
                padding: "10px",
                borderRadius: "4px",
                marginBottom: "15px",
              }}
            >
              {error}
            </div>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
