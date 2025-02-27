import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { loginEmployee } from "../services/employeeService";
import toast from "react-hot-toast";
import { useUser } from "../hooks/useUser";

export default function LoginEmployeePage() {
  const { saveUserLocalstorage, user } = useUser();
  const navigate = useNavigate();

  // State variables
  const [email, setEmail] = useState(""); // Changed from name to email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/employee/dashboard");
    }
  }, [navigate, user]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginEmployee({email, password}); // Changed from name to email
      toast.success("Login successful!");
      saveUserLocalstorage(data?.user, data.token);
      navigate("/employee/dashboard");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Login failed. Please check your credentials."
      );
      setError(
        err?.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 430,
          borderRadius: 4,
          textAlign: "center",
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Header */}
        <Typography
          variant="h5"
          fontWeight="bold"
          color="primary"
          mb={3}
          sx={{ letterSpacing: "1px", textTransform: "uppercase" }}
        >
          Employee Login
        </Typography>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <TextField
            label="Email"
            fullWidth
            type="email" // Changed from text to email
            variant="outlined"
            size="large"
            value={email} // Changed from name to email
            onChange={(e) => setEmail(e.target.value)} // Changed from setName to setEmail
            required
            InputProps={{
              style: { borderRadius: "10px" },
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#d1d1d1",
                },
                "&:hover fieldset": {
                  borderColor: "#9c27b0",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#673ab7",
                },
              },
            }}
          />

          {/* Password Field */}
          <TextField
            label="Password"
            fullWidth
            type="password"
            variant="outlined"
            size="large"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              style: { borderRadius: "10px" },
            }}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#d1d1d1",
                },
                "&:hover fieldset": {
                  borderColor: "#9c27b0",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#673ab7",
                },
              },
            }}
          />

          {/* Error Message */}
          {error && (
            <Typography
              color="error"
              fontSize={14}
              textAlign="center"
              sx={{
                mb: 2,
                fontWeight: "medium",
                letterSpacing: "0.5px",
              }}
            >
              {error}
            </Typography>
          )}

          {/* Submit Button */}
          <Button
            size="large"
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            disabled={loading}
            sx={{
              height: 50,
              borderRadius: "10px",
              fontSize: 16,
              fontWeight: "bold",
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)",
                backgroundColor: "#512da8",
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </form>

        {/* Register Link */}
        <Typography
          textAlign="center"
          mt={3}
          fontSize={14}
          color="text.secondary"
          sx={{
            letterSpacing: "0.5px",
            fontWeight: "medium",
          }}
        >
          Don't have an employee account?{" "}
          <Link
            to="https://skype.com/"
            style={{
              textDecoration: "none",
              color: "#673ab7",
              fontWeight: "bold",
              transition: "color 0.2s ease-in-out",
            }}
            onMouseOver={(e) => (e.target.style.color = "#512da8")}
            onMouseOut={(e) => (e.target.style.color = "#673ab7")}
          >
            Contact Manager
          </Link>
        </Typography>

        <Typography
          textAlign="center"
          mt={3}
          fontSize={14}
          color="text.secondary"
          sx={{
            letterSpacing: "0.5px",
            fontWeight: "medium",
          }}
        >
          Are you a manager or company admin?{" "}
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "#673ab7",
              fontWeight: "bold",
              transition: "color 0.2s ease-in-out",
            }}
            onMouseOver={(e) => (e.target.style.color = "#512da8")}
            onMouseOut={(e) => (e.target.style.color = "#673ab7")}
          >
            Manager/Company Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
