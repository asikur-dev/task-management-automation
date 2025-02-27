const prisma = require("../config/prisma");

module.exports = {
  /**
   * GET non-working days for the current company
   */
  async getNonWorkingDays(req, res) {
    try {
      if (req.role !== "company") {
        return res
          .status(403)
          .json({ message: "Only company admin can manage non-working days." });
      }

      const companyId = req.companyId;

      // Fetch all non-working days for the company
      const nonWorkingDays = await prisma.non_working_days.findMany({
        where: {
          company_id: companyId,
        },
      });

      res.json(nonWorkingDays);
    } catch (err) {
      console.error("getNonWorkingDays error:", err);
      res.status(500).json({ message: "Server error." });
    }
  },

  /**
   * Add a non-working day
   */
  async addNonWorkingDay(req, res) {
    try {
      if (req.role !== "company") {
        return res
          .status(403)
          .json({ message: "Only company admin can manage non-working days." });
      }

      const companyId = req.companyId;
      const { date_value, day_of_week, description } = req.body;
      // Example backend validation
      if (typeof parseInt(day_of_week) !== "number" || day_of_week < 0 || day_of_week > 6) {
        throw new Error("Invalid day_of_week value");
      }

      // Insert the non-working day
      await prisma.non_working_days.create({
        data: {
          company_id: companyId,
          date_value: date_value ? new Date(date_value) : null,
          day_of_week: day_of_week || null,
          description: description || null,
        },
      });

      res.status(201).json({ message: "Non-working day added successfully." });
    } catch (err) {
      console.error("addNonWorkingDay error:", err);
      res.status(500).json({ message: "Server error." });
    }
  },

  /**
   * Delete a non-working day
   */
  async deleteNonWorkingDay(req, res) {
    try {
      if (req.role !== "company") {
        return res
          .status(403)
          .json({ message: "Only company admin can manage non-working days." });
      }

      const companyId = req.companyId;
      const { id } = req.params;

      // Verify the non-working day belongs to the company
      const nonWorkingDay = await prisma.non_working_days.findUnique({
        where: {
          id,
          company_id: companyId,
        },
      });

      if (!nonWorkingDay) {
        return res
          .status(404)
          .json({ message: "Non-working day not found for this company." });
      }

      // Delete the non-working day
      await prisma.non_working_days.delete({
        where: {
          id,
        },
      });

      res.json({ message: "Non-working day deleted successfully." });
    } catch (err) {
      console.error("deleteNonWorkingDay error:", err);
      res.status(500).json({ message: "Server error." });
    }
  },
};
