import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        credentials,
      );

      // LocalStorage mein Token aur Role save kar rahe hain
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", res.data.username);

      // Login ke baad Dashboard pe bhej do
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login Failed");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f6f8",
      }}
    >
      <Card elevation={4} sx={{ width: 400, p: 2, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h4" fontWeight="bold" textAlign="center" mb={1}>
            Billing App
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            mb={4}
          >
            Sign in to continue
          </Typography>

          {error && (
            <Typography color="error" textAlign="center" mb={2}>
              {error}
            </Typography>
          )}

          <TextField
            fullWidth
            label="Username"
            name="username"
            onChange={handleChange}
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            onChange={handleChange}
            sx={{ mb: 4 }}
          />
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleLogin}
            sx={{ backgroundColor: "#2c3e50", mb: 2 }}
          >
            Login
          </Button>
          <Button
            fullWidth
            color="primary"
            onClick={() => navigate("/register")}
          >
            New User? Create an Account
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
