import React from "react";
import { Box, Typography, Paper, Button, Grid, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/layout/AppHeader";
import { Business, Settings, People, Event } from "@mui/icons-material";
import { useUser } from "../hooks/useUser";

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const {user}=useUser();

  const dashboardOptions = [
    {
      title: "Company Settings",
      description: "Update company branding, subscription, and preferences.",
      icon: <Settings sx={{ fontSize: 48, color: "#1976d2" }} />,
      action: () => navigate("/company/settings"),
    },
    {
      title: "Manage Managers",
      description: "Add, remove, or update company managers.",
      icon: <People sx={{ fontSize: 48, color: "#4caf50" }} />,
      action: () => navigate("/company/managers"),
    },
    {
      title: "Non-Working Days",
      description: "Configure company-wide non-working days.",
      icon: <Event sx={{ fontSize: 48, color: "#f57c00" }} />,
      action: () => navigate("/company/non-working-days"),
    },
  ];

  return (
    <>
      <AppHeader title="Company Dashboard" />
      <Box sx={{ p: 4 }}>
        {/* Welcome Section */}
        <Paper
          elevation={3}
          sx={{
            display: "flex",
            alignItems: "center",
            p: 3,
            mb: 4,
            borderRadius: 3,
            bgcolor: "background.paper",
          }}
        >
          <Avatar sx={{ bgcolor: "#673ab7", width: 70, height: 70, mr: 2 }}>
            <Business sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Welcome, Company Admin {user?.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage subscription, branding, managers, and settings.
            </Typography>
          </Box>
        </Paper>

        {/* Dashboard Options */}
        <Grid container spacing={4}>
          {dashboardOptions.map((option, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={5}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  p: 3,
                  borderRadius: 3,
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>{option.icon}</Box>
                <Typography variant="h6" fontWeight="bold">
                  {option.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {option.description}
                </Typography>
                <Button
                  variant="contained"
                  onClick={option.action}
                  sx={{ borderRadius: 20, textTransform: "none", fontWeight: "bold" }}
                >
                  Go
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
