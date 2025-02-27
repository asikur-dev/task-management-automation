// src/routes/managerRoutes.js
const express = require("express");
const router = express.Router();
const ManagerController = require("../controllers/ManagerController");
const authMiddleware = require("../middlewares/authMiddleware");

// Must be "company" role to manage managers
router.post("/add", authMiddleware, ManagerController.addManager);
router.put("/deactivate/:id", authMiddleware, ManagerController.deactivateManager);
router.put("/reset-password/:id", authMiddleware, ManagerController.resetManagerPassword);
router.get("/", authMiddleware, ManagerController.getAllManagers);

router.get("/profile", authMiddleware, ManagerController.getManagerProfile);
router.put("/:id", authMiddleware, ManagerController.updateManager);
router.delete("/:id", authMiddleware, ManagerController.deleteManager);

module.exports = router;
