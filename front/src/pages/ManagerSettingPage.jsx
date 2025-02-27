import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import AppHeader from "../components/layout/AppHeader";
import { getManagerProfile, updateManager } from "../services/managerService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: "100%",
  maxWidth: 600,
  borderRadius: 12,
  boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.12)",
  background: "#fff",
}));

const StyledButton = styled(Button)({
  textTransform: "none",
  fontWeight: "bold",
  borderRadius: 12,
  padding: "12px 24px",
  fontSize: "16px",
  transition: "all 0.3s",
  ":hover": {
    transform: "translateY(-2px)",
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
  },
});

export default function ManagerSettingPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const formatDateTime = (dateString) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const fetchProfile = async () => {
    try {
      const data = await getManagerProfile();
      setName(data.name || "");
      setEmail(data.email || "");
      setCreatedAt(formatDateTime(data.created_at));
      setUpdatedAt(formatDateTime(data.updated_at));
    } catch (err) {
      setError("Failed to load manager profile");
      toast.error("Failed to load manager profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setError("");
      await updateManager({
        name,
        email,
        password,
      });
      toast.success("Profile updated successfully");
        // navigate("/manager/dashboard");

        fetchProfile();
    } catch (err) {
      toast.error("Save failed.");
      setError("Save failed");
    }
  };

  return (
    <>
      <AppHeader title="Manager Settings" />
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <StyledPaper>
          <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
            Manager Profile
          </Typography>
          <Divider sx={{ mb: 3 }} />
          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {error && (
                <Typography color="error" mb={2} textAlign="center">
                  {error}
                </Typography>
              )}
              <Box display="flex" flexDirection="column" gap={3}>
                <TextField
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  variant="outlined"
                  required
                />
                <TextField
                  label="Email"
                  value={email}
                  fullWidth
                  variant="outlined"
                  disabled
                />
                <TextField
                  label="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  variant="outlined"
                  type="password"
                  helperText="Leave blank to keep the current password."
                />
                <Divider />
                <Typography variant="subtitle2" color="textSecondary">
                  Created At: {createdAt}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Last Updated: {updatedAt}
                </Typography>
                <StyledButton
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                >
                  Save Changes
                </StyledButton>
              </Box>
            </>
          )}
        </StyledPaper>
      </Box>
    </>
  );
}
