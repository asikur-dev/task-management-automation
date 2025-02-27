const prisma = require("../config/prisma");

module.exports = {
  /**
   * List all leaves for the manager's employees
   */
  async getLeaves(req, res) {
    try {
      if (req.role !== "manager") {
        return res.status(403).json({ message: "Access denied. Manager only." });
      }

      const managerId = req.userId;

      // Fetch all leaves for employees managed by this manager
      const leaves = await prisma.employee_leaves.findMany({
        where: {
         employee: {
            manager_id: managerId,
          },
        },
        include: {
          employee: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          start_date: "desc",
        },
      });

      // Transform the data to match the original response format
      const formattedLeaves = leaves.map((leave) => ({
        id: leave.id,
        employee_id: leave.employee_id,
        start_date: leave.start_date,
        end_date: leave.end_date,
        reason: leave.reason,
        employee_name: leave.employee.name,
      }));

      res.json(formattedLeaves);
    } catch (err) {
      console.error("getLeaves error:", err);
      res.status(500).json({ message: "Server error." });
    }
  },

  /**
   * Add a leave for an employee
   */
  async addLeave(req, res) {
    try {
      if (req.role !== "manager") {
        return res.status(403).json({ message: "Access denied. Manager only." });
      }

      const managerId = req.userId;
      const { employee_id, start_date, end_date, reason } = req.body;
      console.log({ employee_id, start_date, end_date, reason });

      // Verify the employee belongs to this manager
      const employee = await prisma.employees.findUnique({
        where: {
          id: employee_id,
          manager_id: managerId,
        },
      });

      if (!employee) {
        return res.status(404).json({ message: "Employee not found for this manager." });
      }

      // Insert the leave record
      await prisma.employee_leaves.create({
        data: {
          employee_id,
          start_date: new Date(start_date),
          end_date: new Date(end_date),
          reason: reason || null,
        },
      });

      res.status(201).json({ message: "Employee leave added successfully." });
    } catch (err) {
      console.error("addLeave error:", err);
      res.status(500).json({ message: "Server error." });
    }
  },

  /**
   * Delete or remove a leave record
   */
  async deleteLeave(req, res) {
    try {
      if (req.role !== "manager") {
        return res.status(403).json({ message: "Access denied. Manager only." });
      }

      const managerId = req.userId;
      const { id } = req.params;

      // Check if the leave record exists and belongs to the manager's employee
      const leaveRecord = await prisma.employee_leaves.findFirst({
        where: {
          id,
          employee: {
            manager_id: managerId,
          },
        },
      });

      if (!leaveRecord) {
        return res
          .status(404)
          .json({ message: "Leave record not found for this manager." });
      }

      // Delete the leave record
      await prisma.employee_leaves.delete({
        where: {
          id,
        },
      });

      res.json({ message: "Leave record deleted." });
    } catch (err) {
      console.error("deleteLeave error:", err);
      res.status(500).json({ message: "Server error." });
    }
  },

  /**
   * Update a leave record
   */
  async updateLeave(req, res) {
    try {
      if (req.role !== "manager") {
        return res.status(403).json({ message: "Access denied. Manager only." });
      }

      const managerId = req.userId;
      const { id } = req.params; // Leave ID to update
      const { start_date, end_date, reason } = req.body;

      // Check if the leave record exists and belongs to the manager's employee
      const leaveRecord = await prisma.employee_leaves.findFirst({
        where: {
          id,
          employee: {
            manager_id: managerId,
          },
        },
      });

      if (!leaveRecord) {
        return res
          .status(404)
          .json({ message: "Leave record not found for this manager." });
      }

      // Build the update data dynamically based on provided fields
      const updateData = {};
      if (start_date) updateData.start_date = new Date(start_date);
      if (end_date) updateData.end_date = new Date(end_date);
      if (reason !== undefined) updateData.reason = reason || null;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No fields to update." });
      }

      // Update the leave record
      await prisma.employee_leaves.update({
        where: {
          id,
        },
        data: updateData,
      });

      res.json({ message: "Leave record updated successfully." });
    } catch (err) {
      console.error("updateLeave error:", err);
      res.status(500).json({ message: "Server error." });
    }
  },
};
