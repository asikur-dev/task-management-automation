// src/routes/checkinSessionRoutes.js
const express = require("express");
const router = express.Router();
const CheckinSessionController = require("../controllers/CheckinSessionController");
const authMiddleware = require("../middlewares/authMiddleware");

// For manager actions only (like listing, creating sessions)
router.use(authMiddleware);
router.get("/", CheckinSessionController.getSessions);
router.get("/employee/:employeeId", CheckinSessionController.getSessionsByEmployee);
router.post("/create", CheckinSessionController.createSession);
router.delete("/:sessionId", CheckinSessionController.deleteSession);
router.put("/:sessionId", CheckinSessionController.updateSession);


// Optionally, these might be open if an employee can call them without manager role
// We'll keep them unprotected or partially protected for demonstration:
router.post("/start", CheckinSessionController.startSession);
router.post("/end", CheckinSessionController.endSession);

module.exports = router;
