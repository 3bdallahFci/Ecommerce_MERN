import { Container, TextField, Box, Typography, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import { BASE_URL } from "../constants/BaseUrl";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from "../Context/AuthContext";

const LoginPage = () => {
  const {login} = useAuth()
 const navigate =  useNavigate()
  const [error, setError] = useState<any>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const onsubmit = async () => {
    try {
      const email = emailRef.current?.value;
      const password = passwordRef.current?.value;

      const response = await fetch(`${BASE_URL}/user/login`, {
        body: JSON.stringify({email,password}),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login Failed");
      }
      if (!email) {
        setError("email is not founded");
        return
      }
      login(email,data)
      navigate("/")
      
    } catch (error) {
      setError(error || "LOGIN failed");
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
        <Typography variant="h4">Login to your Account</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "auto",
            gap: 2,
            mt: 2,
            p: 2,
            border: 3,
            borderColor: "darkCyan",
            borderRadius:"10px"
            
          }}
        >
          <FontAwesomeIcon
            icon={faEnvelope}
            style={{ width: "50px", height: "50px" }}
          />

          <TextField label="email" name="email" fullWidth inputRef={emailRef} />
          <TextField label="password" name="password" fullWidth inputRef={passwordRef}/>
          <Button variant="contained" fullWidth onClick={onsubmit} sx={{backgroundColor:"#cfa4ff"}}>
            Login
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

export default LoginPage;
