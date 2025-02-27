// src/routes/tasksRoutes.js
const express = require("express");
const router = express.Router();
const TasksController = require("../controllers/TaskController");
const authMiddleware = require("../middlewares/authMiddleware");
router.get("/session/:sessionId", TasksController.getTasksBySession);

router.use(authMiddleware);

// GET tasks by session
router.get("/", TasksController.getTasks);

// Create tasks (morning)
router.post("/", TasksController.createTask);

// Update tasks (evening)
router.put("/:id", TasksController.updateTask);

// Delete tasks (evening)
router.delete("/:id", TasksController.deleteTask);

module.exports = router;
