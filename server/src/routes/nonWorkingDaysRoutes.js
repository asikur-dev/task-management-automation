// src/routes/nonWorkingDaysRoutes.js
const express = require("express");
const router = express.Router();
const NonWorkingDaysController = require("../controllers/NonWorkingDaysController");
const authMiddleware = require("../middlewares/authMiddleware");

// Must be "company" role to manage non-working days
router.use(authMiddleware);

router.get("/", NonWorkingDaysController.getNonWorkingDays);
router.post("/", NonWorkingDaysController.addNonWorkingDay);
router.delete("/:id", NonWorkingDaysController.deleteNonWorkingDay);

module.exports = router;
