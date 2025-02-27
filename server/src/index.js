// src/index.js
const authRoutes = require("./routes/authRoutes");
const companyRoutes = require("./routes/companyRoutes");
const managerRoutes = require("./routes/managerRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const employeeLeavesRoutes = require("./routes/employeeLeavesRoutes");
const nonWorkingDaysRoutes = require("./routes/nonWorkingDaysRoutes");
const tasksRoutes = require("./routes/tasksRoutes");
const checkinSessionRoutes = require("./routes/checkinSessionRoutes");
const openaiRoutes = require("./routes/openaiRoutes");
const setupDatabase = require("./config/setupDB");

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { startCronJobs } = require("./services/schedulingService");
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/errorHandlers");
const AppError = require("./utils/AppError");
const app = express();

// Setup
app.use(cors());
app.use(express.json());

// Connect to DB (db.js) if needed - though it's often just required in controllers
// Setup Database
// setupDatabase();
app.get("/api", (req, res) => {
  res.json({
    message: "Hello from the server!"
  });
});
// Import routes

// Use routes
// For authentication (company sign-up / login)
app.use("/api/auth", authRoutes);

// For company (profile, subscription, branding)
app.use("/api/company", companyRoutes);

// For manager management
app.use("/api/managers", managerRoutes);

// For employee management
app.use("/api/employees", employeeRoutes);

// For non-working days management
app.use("/api/employee-leaves", employeeLeavesRoutes);
// For non-working days management
app.use("/api/non-working-days", nonWorkingDaysRoutes);

app.use("/api/checkin-sessions", checkinSessionRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/openai", openaiRoutes);
// Start cron jobs
startCronJobs();

// Start the server
// ✅ Example Route with Custom Error
app.get("/api/test-error", (req, res, next) => {
  next(new AppError("This is a custom error!", 400)); // Throws a 400 Bad Request error
});

// ✅ Not Found Handler (Must be after all routes)
app.use(notFoundHandler);

// ✅ Global Error Handler
app.use(errorHandler);
const PORT = process.env.PORT || 4000;
// This will work if you're using Node.js 18.x or later



app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
