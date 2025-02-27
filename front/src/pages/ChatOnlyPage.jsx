import React from "react";
import { Box, Typography, Container, Button } from "@mui/material";
import AppHeader from "../components/layout/AppHeader";
import ChatOnlyComponent from "./chat/ChatOnlyComponent";

export default function ChatPage() {

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden", // Prevent vertical overflow
      }}
    >
      {/* Header */}
      <AppHeader title="Check-In Chat" />

      {/* Main Content */}
      <Container
        maxWidth="100vw" // Restrict width for better readability
        sx={{
          flexGrow: 1,
          p: [2, 3],
          overflow: "hidden", // Ensure no overflow
          display: "flex",
          flexDirection: "column",
        }}
      > <Button sx={{ mb: 2, width: "fit-content" }} variant="contained" onClick={() => {
          localStorage.removeItem("chatHistory");
            window.location.reload()
      }}>
                + New Chat
              </Button>


        {/* //   <Typography variant="h5" mb={1}>
      //     Daily Check-In #{sessionId}
      //   </Typography>
      //   <Typography variant="h6" mb={2}>
      //     Let’s do a quick daily check-in
      //   </Typography> */}

        {/* Chat Component */}
        <Box
          sx={{
            flexGrow: 1,
            height: "100%",
            overflow: "hidden", // Prevent overflow
            borderRadius: "10px",
            border: "1px solid #ccc",
            backgroundColor: "#f9f9f9",
          }}
        >
          <ChatOnlyComponent />
        </Box>
      </Container>
    </Box>
  );
}
