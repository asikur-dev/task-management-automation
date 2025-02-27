import React from "react";
import { Box, Typography, Container } from "@mui/material";
import AppHeader from "../components/layout/AppHeader";
import ChatComponent from "./chat/ChatComponent";
import { useParams } from "react-router-dom";

export default function ChatPage() {
  const { sessionId, sessionType } = useParams();

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
          p: [2,3],
          overflow: "hidden", // Ensure no overflow
          display: "flex",
          flexDirection: "column",
        }}
      >

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
          <ChatComponent sessionId={sessionId} sessionType={sessionType} />
        </Box>
      </Container>
    </Box>
  );
}
