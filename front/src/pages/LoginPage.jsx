import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { loginCompany, loginManager } from "../services/authService";
import toast from "react-hot-toast";
import { useUser } from "../hooks/useUser";

export default function LoginPage() {
  const { saveUserLocalstorage, user } = useUser();
  const navigate = useNavigate();

  // State variables
  const [role, setRole] = useState("company");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = user?.role;
    if (token && role) {
      navigate(role === "company" ? "/company/dashboard" : "/manager/dashboard");
    }
  }, [navigate, user]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data =
        role === "company"
          ? await loginCompany(email, password)
          : await loginManager(email, password);
      toast.success("Login successful!");
      saveUserLocalstorage(data?.user, data.token);
      navigate(role === "company" ? "/company/dashboard" : "/manager/dashboard");
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
          maxWidth: 400,
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
          Daily Check-In Login
        </Typography>

        {/* Role Selection */}
        <RadioGroup
          row
          value={role}
          onChange={(e) => setRole(e.target.value)}
          sx={{
            mb: 3,
            justifyContent: "center",
            "& .MuiFormControlLabel-label": {
              fontSize: 14,
              fontWeight: "medium",
              color: "#444",
            },
          }}
        >
          <FormControlLabel
            value="company"
            control={<Radio />}
            label="Company"
            sx={{
              "& .MuiSvgIcon-root": {
                color: "#673ab7",
              },
            }}
          />
          <FormControlLabel
            value="manager"
            control={<Radio />}
            label="Manager"
            sx={{
              "& .MuiSvgIcon-root": {
                color: "#673ab7",
              },
            }}
          />
        </RadioGroup>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <TextField
            label={role === "company" ? "Admin Email" : "Manager Email"}
            fullWidth
            type="email"
            variant="outlined"
            size="large"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              textDecoration: "none",
              color: "#673ab7",
              fontWeight: "bold",
              transition: "color 0.2s ease-in-out",
            }}
            onMouseOver={(e) => (e.target.style.color = "#512da8")}
            onMouseOut={(e) => (e.target.style.color = "#673ab7")}
          >
            Register
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
          Are you an Employee?{" "}
          <Link
            to="/employee/login"
            style={{
              textDecoration: "none",
              color: "#673ab7",
              fontWeight: "bold",
              transition: "color 0.2s ease-in-out",
            }}
            onMouseOver={(e) => (e.target.style.color = "#512da8")}
            onMouseOut={(e) => (e.target.style.color = "#673ab7")}
          >
            Employee Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
