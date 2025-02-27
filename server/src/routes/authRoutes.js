// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

// Company auth
router.post("/company/register", AuthController.registerCompany);
router.post("/company/login", AuthController.loginCompany);

// Manager login
router.post("/manager/login", AuthController.loginManager);

module.exports = router;
