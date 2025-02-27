// src/routes/employeeRoutes.js
const express = require("express");
const router = express.Router();
const EmployeeController = require("../controllers/EmployeeController");
const authMiddleware = require("../middlewares/authMiddleware");

// All these routes require manager login
router.post("/login", EmployeeController.loginEmployee);

router.use(authMiddleware);

router.get("/", EmployeeController.getEmployees); // List employees
router.get("/profile", EmployeeController.getEmployeeProfile); // Get employee
router.post("/", EmployeeController.createEmployee); // Create employee
router.put("/:id", EmployeeController.updateEmployee); // Update employee
router.delete("/:id", EmployeeController.deleteEmployee); // Delete employee

module.exports = router;
