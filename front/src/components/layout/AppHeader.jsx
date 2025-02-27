import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Box,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser"; // Import the useUser hook
import { logout } from "../../services/authService";

export default function AppHeader({ title }) {
  const navigate = useNavigate();
  const { user, clearUser } = useUser(); // Use the useUser hook
  const [anchorEl, setAnchorEl] = React.useState(null); // For user menu

  // Handle logout
  const handleLogout = () => {
    logout();
    clearUser(); // Clear user info from localStorage
    navigate("/");
  };

  // Open user menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close user menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      elevation={2}
      sx={{
        mb: 3,
        bgcolor: "primary.main",
        color: "white",
      }}
    >
      <Toolbar>
        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            textDecoration: "none",
            color: "inherit",
          }}
          component={Link}
          to="/"
        >
          {title || "Daily Check-In"}
        </Typography>

        {/* User Info or Menu */}
        {user ? (
          <>
            {/* User Avatar and Name */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1, // Space between avatar and name
              }}
            >
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                sx={{
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)", // Subtle hover effect
                    borderRadius: "50%",
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "secondary.main",
                    width: 36,
                    height: 36,
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow
                  }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Typography
                variant="subtitle1"
                sx={{
                  display: {xs:"none",sm:"block"}, // Hide on small screens
                  fontWeight: "medium",
                  color: "white",
                }}
              >
                {user.name}
              </Typography>
            </Box>

            {/* User Menu */}
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              PaperProps={{
                elevation: 2,
                sx: {
                  mt: 1, // Add spacing above the menu
                  minWidth: 200,
                  "& .MuiMenuItem-root": {
                    py: 1.5, // Increase padding for better UX
                    "&:hover": {
                      bgcolor: "action.hover", // Hover effect
                    },
                  },
                },
              }}
            >
              <MenuItem disabled>{user.name}</MenuItem>
              <MenuItem disabled>{user.email}</MenuItem>
              <MenuItem disabled>{user.role}</MenuItem>
              <MenuItem sx={{color:"red"}} onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          // Login Button (if no user is logged in)
          <Button color="inherit" onClick={() => navigate("/")}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
