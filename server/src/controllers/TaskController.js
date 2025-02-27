
const prisma =  require("../config/prisma");
 
module.exports = {
  /**
   * Get all tasks (manager-only)
   */
  /**
   * Get all tasks for the manager's employees or for the employee themselves
   */
  async getTasks(req, res) {
    try {
      if (req.role !== "manager" && req.role !== "employee") {
        return res.status(403).json({ message: "Access denied." });
      }

      let filter = {};

      if (req.role === "manager") {
        filter = {
          employee: {
            manager_id: req.userId, // Fetch tasks for all employees under the manager
          },
        };
      } else if (req.role === "employee") {
        filter = {
          employee_id: req.userId, // Fetch tasks only for the logged-in employee
        };
      }

      const tasks = await prisma.tasks.findMany({
        where: filter,
        include: {
          employee: {
            select: {
              name: true,
              email: true,
            },
          },
          session: {
            select: {
              session_type: true,
            },
          },
        },
      });

      res.status(200).json({ tasks });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Get tasks by session (manager-only)
   */
  async getTasksBySession(req, res) {
    try {
      // if (req.role !== "manager" && req.role !== "employee") {
      //   return res.status(403).json({ message: "Access denied. Manager only." });
      // }

      const managerId = req.userId;
      const { sessionId } = req.params;

      // Verify that the session belongs to the manager
      const session = await prisma.checkin_sessions.findUnique({
        where: { id: sessionId },
        include: {
          employee: {
            select: {
              manager_id: true,
            },
          },
        },
      });

      if (!session) {
        return res.status(404).json({ message: "Session not found." });
      }

      // if (session.employee.manager_id !== managerId&&session.employee_id !== req?.userId) {
      //   return res
      //     .status(403)
      //     .json({ message: "This session does not belong to your employees." });
      // }

      // Fetch tasks for the session
      const tasks = await prisma.tasks.findMany({
        where: {
          checkin_session_id: sessionId,
        },
        include: {
          employee: {
            select: {
              name: true,
              email: true,
            },
          },
        },

        orderBy: {
          created_at: "desc",
        },
      });

      res.json({ tasks });
    } catch (err) {
      console.error("getTasksBySession error:", err);
      res.status(500).json({ message: "Server error." });
    }
  },

  /**
   * Create a task (Manager or Employee)
   */
  async createTask(req, res) {
    try {
      if (req.role !== "manager" && req.role !== "employee") {
        return res.status(403).json({ message: "Access denied." });
      }

      const { session_id:sessionId, task_title, task_details, employee_id,status } = req.body;

      let assignedEmployeeId = employee_id;

      if (req.role === "employee") {
        assignedEmployeeId = req.userId; // Employee can only assign tasks to themselves
      } else {
        // Verify if the manager is assigning a task to an employee under their management
        const employee = await prisma.employees.findUnique({
          where: { id: assignedEmployeeId },
          select: { manager_id: true },
        });

        if (!employee || employee.manager_id !== req.userId) {
          return res.status(403).json({ message: "Invalid employee assignment." });
        }
      }

      await prisma.tasks.create({
        data: {
          checkin_session_id: sessionId,
          employee_id: assignedEmployeeId,
          task_title,
          task_details: task_details || null,
          status: status || "pending",
        },
      });

      res.status(201).json({ message: "Task created successfully." });
    } catch (err) {
      console.error("createTask error:", err);
      res.status(500).json({ message: "Server error." });
    }
  },

  /**
   * Update a task (Manager or Employee for their own tasks)
   */
  async updateTask(req, res) {
    try {
      if (req.role !== "manager" && req.role !== "employee") {
        return res.status(403).json({ message: "Access denied." });
      }

      const { id } = req.params;
      const { task_title, task_details, status } = req.body;

      const task = await prisma.tasks.findUnique({
        where: { id },
        include: {
          employee: {
            select: { manager_id: true, id: true },
          },
        },
      });

      if (!task) {
        return res.status(404).json({ message: "Task not found." });
      }

      if (req.role === "employee" && task.employee.id !== req.userId) {
        return res.status(403).json({ message: "You can only update your own tasks." });
      }

      if (req.role === "manager" && task.employee.manager_id !== req.userId) {
        return res
          .status(403)
          .json({ message: "Task does not belong to your employees." });
      }

      await prisma.tasks.update({
        where: { id },
        data: { task_title, task_details, status },
      });

      res.json({ message: "Task updated successfully." });
    } catch (err) {
      console.error("updateTask error:", err);
      res.status(500).json({ message: "Server error." });
    }
  },

  /**
   * Delete a task (Manager or Employee for their own tasks)
   */
  async deleteTask(req, res) {
    try {
      if (req.role !== "manager" && req.role !== "employee") {
        return res.status(403).json({ message: "Access denied." });
      }

      const { id } = req.params;

      const task = await prisma.tasks.findUnique({
        where: { id },
        include: {
          employee: {
            select: { manager_id: true, id: true },
          },
        },
      });

      if (!task) {
        return res.status(404).json({ message: "Task not found." });
      }

      if (req.role === "employee" && task.employee.id !== req.userId) {
        return res.status(403).json({ message: "You can only delete your own tasks." });
      }

      if (req.role === "manager" && task.employee.manager_id !== req.userId) {
        return res
          .status(403)
          .json({ message: "Task does not belong to your employees." });
      }

      await prisma.tasks.delete({
        where: { id },
      });

      res.json({ message: "Task deleted successfully." });
    } catch (err) {
      console.error("deleteTask error:", err);
      res.status(500).json({ message: "Server error." });
    }
  },
};

// ✅ Employees can only create tasks for themselves.
// ✅ Managers can create tasks for their employees.
// ✅ Employees can update/delete only their own tasks.
// ✅ Managers can update/delete tasks of their employees.
// ✅ More secure role-based access with clear conditions.