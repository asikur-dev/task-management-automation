import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Avatar,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/layout/AppHeader";
import { Dashboard as DashboardIcon, Settings } from "@mui/icons-material";
import { People as EmployeesIcon } from "@mui/icons-material";
import { Task as TasksIcon } from "@mui/icons-material";
import { EventNote as LeavesIcon } from "@mui/icons-material";
import { Chat as ChatIcon } from "@mui/icons-material";
import { useUser } from "../hooks/useUser";

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const {user}=useUser();

  const dashboardOptions = [
     {
          title: "Manager Settings",
          description: "Update manager profile, and preferences.",
          icon: <Settings sx={{ fontSize: 48, color: "#1976d2" }} />,
          action: () => navigate("/manager/settings"),
        },
    {
      title: "Manage Employees",
      description: "View and manage employee details.",
      icon: <EmployeesIcon sx={{ fontSize: 48, color: "#1976d2" }} />,
      action: () => navigate("/manager/employees"),
    },
    {
      title: "Manage Check-in Sessions",
      description: "View and manage check-in sessions.",
      icon: <ChatIcon sx={{ fontSize: 48, color: "#673ab7" }} />,
      action: () => navigate("/manager/sessions"),
    },
    {
      title: "Manage Tasks",
      description: "Track and update tasks for employees.",
      icon: <TasksIcon sx={{ fontSize: 48, color: "#4caf50" }} />,
      action: () => navigate("/manager/tasks"),
    },
    {
      title: "Manage Employee Leaves",
      description: "Approve or reject employee leave requests.",
      icon: <LeavesIcon sx={{ fontSize: 48, color: "#f57c00" }} />,
      action: () => navigate("/manager/employee-leaves"),
    },
  ];

  return (
    <>
      <AppHeader title="Manager Dashboard" />
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
          <Avatar
            sx={{
              bgcolor: "#673ab7",
              width: 70,
              height: 70,
              mr: 2,
            }}
          >
            <DashboardIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Welcome, Manager {user?.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage employees, tasks, leave requests, and more.
            </Typography>
          </Box>
        </Paper>

        {/* Dashboard Cards */}
        <Grid container spacing={4}>
          {dashboardOptions.map((option, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                elevation={5}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    flexGrow: 1,
                  }}
                >
                  <Box sx={{ mb: 2 }}>{option.icon}</Box>
                  <Typography variant="h6" fontWeight="bold">
                    {option.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={option.action}
                    sx={{
                      borderRadius: 20,
                      textTransform: "none",
                      fontWeight: "bold",
                      px: 3,
                    }}
                  >
                    Go
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
