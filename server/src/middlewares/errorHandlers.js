// middlewares/errorHandlers.js
const AppError = require("../utils/AppError");

// Not Found Handler (404)
const notFoundHandler = (req, res, next) => {
  next(new AppError("Route not found"+req.path, 404));
};

// Global Error Handler
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err); // Log error for debugging

  // Use AppError statusCode if available, otherwise default to 500
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = { notFoundHandler, errorHandler };
