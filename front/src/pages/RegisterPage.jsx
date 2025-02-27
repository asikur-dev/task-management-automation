import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Grid,
} from "@mui/material";
import { registerCompany } from "../services/authService";
import toast from "react-hot-toast";
import { useUser } from "../hooks/useUser";

export default function RegisterPage() {
  const { saveUserLocalstorage, user } = useUser();
  const navigate = useNavigate();

  // State variables
  const [companyName, setCompanyName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");
  const [subscriptionPlan, setSubscriptionPlan] = useState("Free");
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
      const data = await registerCompany({
        companyName,
        adminEmail,
        password,
        subscription: subscriptionPlan,
      });
      toast.success("Registration successful!");
      saveUserLocalstorage(data?.user, data?.token);
      navigate("/company/dashboard");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Registration failed. Please try again."
      );
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
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
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 500,
          width: "100%",
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
          Create Your Company
        </Typography>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Company Name */}
            <Grid item xs={12}>
              <TextField
                label="Company Name"
                variant="outlined"
                fullWidth
                size="large"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                InputProps={{
                  style: { borderRadius: "10px" },
                }}
                sx={{
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
            </Grid>

            {/* Admin Email */}
            <Grid item xs={12}>
              <TextField
                label="Admin Email"
                type="email"
                variant="outlined"
                fullWidth
                size="large"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
                InputProps={{
                  style: { borderRadius: "10px" },
                }}
                sx={{
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
            </Grid>

            {/* Password */}
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                size="large"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  style: { borderRadius: "10px" },
                }}
                sx={{
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
            </Grid>

            {/* Subscription Plan */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="subscription-plan-label">Subscription Plan</InputLabel>
                <Select
                  labelId="subscription-plan-label"
                  value={subscriptionPlan}
                  onChange={(e) => setSubscriptionPlan(e.target.value)}
                  label="Subscription Plan"
                  size="large"
                  sx={{
                    borderRadius: "10px",
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
                >
                  <MenuItem value="Free">Free</MenuItem>
                  <MenuItem value="Pro">Pro</MenuItem>
                  <MenuItem value="Enterprise">Enterprise</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Error Message */}
            {error && (
              <Grid item xs={12}>
                <Typography
                  color="error"
                  fontSize={14}
                  sx={{
                    textAlign: "left",
                    fontWeight: "medium",
                    letterSpacing: "0.5px",
                  }}
                >
                  {error}
                </Typography>
              </Grid>
            )}

            {/* Submit Button */}
            <Grid item xs={12}>
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
                {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Login Link */}
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
          Already have an account?{" "}
          <Link
            to="/"
            style={{
              textDecoration: "none",
              fontWeight: "bold",
              transition: "color 0.2s ease-in-out",
            }}
            onMouseOver={(e) => (e.target.style.color = "#512da8")}
          >
            Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
