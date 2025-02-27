const express = require("express");
const router = express.Router();
const CompanyController = require("../controllers/companyController");

// Middleware for authentication (Assuming you have an `authMiddleware`)
const authMiddleware = require("../middlewares/authMiddleware");

// Routes for company profile management
router.get("/profile", authMiddleware, CompanyController.getProfile);
router.put("/profile", authMiddleware, CompanyController.updateProfile);

module.exports = router;
