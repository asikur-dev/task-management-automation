import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Home as HomeIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // If using React Router

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 10 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h1" fontWeight="bold" color="primary">
          404
        </Typography>
        <Typography variant="h5" color="textSecondary" gutterBottom>
          Oops! The page you’re looking for doesn’t exist.
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={3}>
          It might have been moved or deleted.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<HomeIcon />}
          onClick={() => navigate("/")}
        >
          Go Home
        </Button>
      </motion.div>
    </Container>
  );
};

export default NotFoundPage;
