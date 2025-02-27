import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import AppHeader from "../components/layout/AppHeader";
import { getCompanyProfile, updateCompanyProfile } from "../services/companyService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import moment from "moment-timezone";

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

export default function CompanySettingPage() {
  const {user}=useUser();
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [colorScheme, setColorScheme] = useState("#ffffff");
  const [subscriptionPlan, setSubscriptionPlan] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await getCompanyProfile();
      setCompanyName(data.company_name || "");
      setLogoUrl(data.logo_url || "");
      setColorScheme(data.color_scheme || "#ffffff");
      setSubscriptionPlan(data.subscription_plan || "");
      setCreatedAt(data.created_at || "");
      setUpdatedAt(data.updated_at || "");
      setPermissions(user?.role || []);
    } catch (err) {
      setError("Failed to load company profile");
      toast.error("Failed to load company profile");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setError("");
      await updateCompanyProfile({
        company_name: companyName,
        logo_url: logoUrl,
        color_scheme: colorScheme,
        subscription_plan: subscriptionPlan,
      });
      toast.success("Profile updated successfully");
      navigate("/company/dashboard");
    } catch (err) {
      toast.error("Save failed.");
      setError("Save failed");
    }
  };

  return (
    <>
      <AppHeader title="Company Settings" />
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <StyledPaper>
          <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
            Company Profile
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
                <Box display="flex" justifyContent="center">
                  <Avatar src={logoUrl} sx={{ width: 80, height: 80, mb: 2 }} />
                </Box>
                {/* <input type="file" accept="image/*" onChange={handleFileUpload} /> */}
                <TextField
                  label="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Logo URL"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Color Scheme"
                  type="color"
                  value={colorScheme}
                  onChange={(e) => setColorScheme(e.target.value)}
                  variant="outlined"
                />
                <Box display="flex" alignItems="center">
                  <Box width={24} height={24} bgcolor={colorScheme} borderRadius={4} />
                  <Typography sx={{ ml: 2 }}>{colorScheme}</Typography>
                </Box>
                <FormControl fullWidth>
                  <InputLabel>Subscription Plan</InputLabel>
                  <Select
                    value={subscriptionPlan}
                    onChange={(e) => setSubscriptionPlan(e.target.value)}
                    label="Subscription Plan"
                  >
                    <MenuItem value="Free">Free</MenuItem>
                    <MenuItem value="Pro">Pro</MenuItem>
                    <MenuItem value="Enterprise">Enterprise</MenuItem>
                  </Select>
                </FormControl>
                <Typography variant="body2">Created At: {moment(createdAt).format("MMMM Do YYYY, h:mm:ss a")}</Typography>
                <Typography variant="body2">Updated At: {moment(updatedAt).format("MMMM Do YYYY, h:mm:ss a")}</Typography>
                <Typography variant="body2">
                  Permissions: {permissions|| "None"}
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
