const express = require("express");
const router = express.Router();
const OpenAIController = require("../controllers/OpenAIController");
const OpenAIControllerUnAuth = require("../controllers/OpenAIControllerUnAuth");
const authMiddleware = require("../middlewares/authMiddleware"); // Import auth middleware

// Check if authentication is required based on the environment variable
const REQUIRE_AUTH = process.env.REQUIRE_AUTH === "true"; // Default to false if not set

// Conditionally apply authMiddleware
if (REQUIRE_AUTH) {
  router.use(authMiddleware); // Apply auth middleware globally for all routes
}

// Define routes
router.post("/chat", REQUIRE_AUTH ? OpenAIController.chat : OpenAIControllerUnAuth.chat);
router.post("/chat-only", OpenAIController.chatOnly); // No auth required for chat-only
router.get("/get-chat-history/:sessionId", OpenAIController.getChatHistory);

module.exports = router;
