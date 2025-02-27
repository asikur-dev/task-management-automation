const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
module.exports = {
  /**
   * Create a new manager under the current company
   */
  async addManager(req, res) {
    try {
      if (req.role !== "company") {
        return res
          .status(403)
          .json({ message: "Forbidden. Only company admin allowed." });
      }

      const companyId = req.companyId;
      const { name, email, password } = req.body;

      // Check if the email is already used
      const existingManager = await prisma.managers.findUnique({
        where: {
          email,
        },
      });

      if (existingManager) {
        return res.status(400).json({ message: "Manager email already exists." });
      }

      // Hash the password
      const hashedPass = await bcrypt.hash(password, 10);

      // Insert the new manager
      await prisma.managers.create({
        data: {
          company_id: companyId,
          name,
          email,
          password_hash: hashedPass,
          is_active: true, // Default to active
        },
      });

      res.status(201).json({ message: "Manager added successfully." });
    } catch (err) {
      console.error("addManager error:", err);
      res.status(500).json({ message: "Server error." });
    }
  },

  /**
   * Deactivate or activate a manager (toggle `is_active`)
   */
  async deactivateManager(req, res) {
    try {
      if (req.role !== "company") {
        return res
          .status(403)
          .json({ message: "Forbidden. Only company admin allowed." });
      }

      const managerId = req.params.id;
      const companyId = req.companyId;

      // Fetch the manager and verify they belong to the company
      const manager = await prisma.managers.findUnique({
        where: {
          id: managerId,
          company_id: companyId,
        },
      });

      if (!manager) {
        return res.status(404).json({ message: "Manager not found for this company." });
      }

      // Toggle the `is_active` status
      const newStatus = !manager.is_active;

      await prisma.managers.update({
        where: {
          id: managerId,
        },
        data: {
          is_active: newStatus,
        },
      });

      res.json({
        message: `Manager ${newStatus ? "activated" : "deactivated"} successfully.`,
        is_active: newStatus,
      });
    } catch (err) {
      console.error("deactivateManager error:", err);
      res.status(500).json({ message: "Server error." });
    }
  },

  /**
   * Reset a manager's password
   */
  async resetManagerPassword(req, res) {
    try {
      if (req.role !== "company") {
        return res
          .status(403)
          .json({ message: "Forbidden. Only company admin allowed." });
      }

      const managerId = req.params.id;
      const { newPassword } = req.body;
      const companyId = req.companyId;

      // Verify the manager belongs to the company
      const manager = await prisma.managers.findUnique({
        where: {
          id: managerId,
          company_id: companyId,
        },
      });

      if (!manager) {
        return res.status(404).json({ message: "Manager not found in this company." });
      }

      // Hash the new password
      const hashedPass = await bcrypt.hash(newPassword, 10);

      // Update the manager's password
      await prisma.managers.update({
        where: {
          id: managerId,
        },
        data: {
          password_hash: hashedPass,
        },
      });

      res.json({ message: "Manager password reset successfully." });
    } catch (err) {
      console.error("resetManagerPassword error:", err);
      res.status(500).json({ message: "Server error." });
    }
  },

  /**
   * Get a list of managers in the company
   */
  async getAllManagers(req, res) {
    try {
      if (req.role !== "company") {
        return res
          .status(403)
          .json({ message: "Forbidden. Only company admin allowed." });
      }

      const companyId = req.companyId;

      // Fetch all managers belonging to the company
      const managers = await prisma.managers.findMany({
        where: {
          company_id: companyId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          is_active: true,
          created_at: true,
          updated_at: true,
          
        },
        orderBy: {
          updated_at: "desc",
        },
      });

      res.json(managers);
    } catch (err) {
      console.error("getAllManagers error:", err);
      res.status(500).json({ message: "Server error." });
    }
  },
  async getManagerProfile(req, res) {
    try {
      const managerId = req.userId
      const manager = await prisma.managers.findUnique({ where: { id: managerId } });
      if(!manager){
        return res.status(404).json({ message: "Manager not found." });
      }
      res.json(manager);
    } catch (err) {
      console.error("getManagerProfile error:", err);
      res.status(500).json({ message: "Server error." });
  }
  },
  async updateManager(req, res) {
    try {
      const userId = req.userId
      const { name, email, password: newPassword } = req.body
      const manager = await prisma.managers.findFirst({ where: {OR: [{ id: userId }, { email: email }]}, select: { id: true, company_id: true } });
      if(!manager){
        return res.status(404).json({ message: "Manager not found." });
      } 

      if (manager?.id !== userId && manager?.company_id !== userId) {
        return res.status(403).json({ message: "Access denied. Manager  OR Company admin only" });
      }
      

      // Hash the new password if provided
      let hashedPass;
      if (newPassword) {
        hashedPass = await bcrypt.hash(newPassword, 10);
      }
      await prisma.managers.update({
        where: {
          email,
        },
        data: {
          name,
          email:manager?.company_id===userId?email:manager?.email,
          ...(hashedPass && { password_hash: hashedPass }),
        },
      });
      res.json({ message: "Manager updated successfully." });
    } catch (err) {
      console.error("updateManager error:", err);
      res.status(500).json({ message: "Server error." });
  }
  },
  async deleteManager(req, res) {
    try {
      if (req.role !== "company") {
        return res
          .status(403)
          .json({ message: "Forbidden. Only company admin allowed." });
      }
      const managerId = req.params.id;
      const manager = await prisma.managers.findUnique({
        where: {
          id: managerId,
        },
      });
      if (!manager) {
        return res.status(404).json({ message: "Manager not found for this company." });
      }
      await prisma.managers.delete({
        where: {
          id: managerId,
        },
      });
      res.json({ message: "Manager deleted successfully." });
    } catch (err) {
      console.error("deleteManager error:", err);
      res.status(500).json({ message: "Server error." });
    }
  },
};

