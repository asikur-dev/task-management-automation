// src/routes/employeeLeavesRoutes.js
const express = require("express");
const router = express.Router();
const EmployeeLeavesController = require("../controllers/EmployeeLeavesController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use(authMiddleware); // Must be manager

router.get("/", EmployeeLeavesController.getLeaves);
router.post("/", EmployeeLeavesController.addLeave);
router.put("/:id",EmployeeLeavesController.updateLeave)

router.delete("/:id", EmployeeLeavesController.deleteLeave);

module.exports = router;
