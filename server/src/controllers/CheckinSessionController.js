const prisma = require("../config/prisma");

module.exports = {
  /**
   * Get sessions by manager
   *
   * */
  async getSessions(req, res) {
    try {
      if (req.role !== "manager") {
        return res.status(403).json({ message: "Access denied. Manager only." });
      }

      const managerId = req.userId; // from token
      const sessions = await prisma.checkin_sessions.findMany({
        where: {
          employee: {
            manager_id: managerId,
          },
        },
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          device_info: true,
        },
        orderBy: {
          session_date: "desc",
        },
      });

      res.json({ sessions });
    } catch (err) {
      console.error("getSessions error:", err);
      res.status(500).json({ message: "Server error." });
    }
  },
  /**
   * Manager fetches check-in sessions for an employee.
   */
  async getSessionsByEmployee(req, res) {
    try {
      if (req.role !== "manager") {
        return res.status(403).json({ message: "Access denied. Manager only." });
      }

      const managerId = req.userId; // from token
      const { employeeId } = req.params;

      // Verify the employee belongs to this manager
      const employee = await prisma.employees.findUnique({
        where: {
          id: employeeId,
          manager_id: managerId,
        },
      });

      if (!employee) {
        return res.status(404).json({ message: "Employee not found for this manager." });
      }

      // Get all sessions for the employee
      const sessions = await prisma.checkin_sessions.findMany({
        where: {
          employee_id: employeeId,
        },
        orderBy: {
          session_date: "desc",
        },
      });

      res.json(sessions);
    } catch (err) {
      console.error("getSessionsByEmployee error:", err);
      res.status(500).json({ message: "Server error." });
    }
  },

  /**
   * Create a check-in session for an employee.
   */
  async createSession(req, res) {
    try {
      if (req.role !== "manager") {
        return res.status(403).json({ message: "Access denied. Manager only." });
      }

      const managerId = req.userId;
      const { employeeId, session_type, session_date } = req.body;

      // Verify the employee belongs to this manager
      const employee = await prisma.employees.findUnique({
        where: {
          id: employeeId,
          manager_id: managerId,
        },
      });
       console.log({ employee });

      if (!employee) {
        return res
          .status(404)
          .json({ message: "Employee not found under this manager." });
      }

      // Create the check-in session
      await prisma.checkin_sessions.create({
        data: {
          employee_id: employeeId,
          session_type,
          session_date: new Date(session_date),
          email_sending_time: new Date(),
        },
      });

      res.status(201).json({ message: "Check-in session created." });
    } catch (err) {
      console.error("createSession error:", err);
      res.status(500).json({ message: "Server error." });
    }
  },
  /**
   * Update a check-in session
   */
  async updateSession(req, res) {
    try {
      if (req.role !== "manager") {
        return res.status(403).json({ message: "Access denied. Manager only." });
      }
      const { sessionId } = req.params;
      const { session_type, session_date, } = req.body;

      await prisma.checkin_sessions.update({
        where: { id: sessionId },
        data: {
          session_type,
          session_date: new Date(session_date),
        },
      });
      res.json({ message: "Check-in session updated." });
    } catch (err) {
      console.error("updateSession error:", err);
      res.status(500).json({ message: "Server error." });
    }
  },

  /**
   * Delete a check-in session
   */
  async deleteSession(req, res) {
    try {
      if (req.role !== "manager") {
        return res.status(403).json({ message: "Access denied. Manager only." });
      }
      const { sessionId } = req.params;

      await prisma.checkin_sessions.delete({
        where: { id: sessionId },
      });
      res.json({ message: "Check-in session deleted." });
    } catch (err) {
      console.error("deleteSession error:", err);
      res.status(500).json({ message: "Server error." });
    }
  },

  /**
   * Start a check-in session when the employee opens the link.
   */
  async startSession(req, res) {
    try {
      const { sessionId, ipAddress, deviceInfo } = req.body;

      // Update the session to mark it as started
      await prisma.checkin_sessions.update({
        where: {
          id: sessionId,
        },
        data: {
          session_start_time: new Date(),
          ip_address: ipAddress || null,
          device_info: deviceInfo || null,
        },
      });

      res.json({ message: "Session started." });
    } catch (err) {
      console.error("startSession error:", err);
      res.status(500).json({ message: "Server error." });
    }
  },

  /**
   * End a check-in session when the employee finishes the conversation.
   */
  async endSession(req, res) {
    try {
      const { sessionId } = req.body;

      // Update the session to mark it as ended and calculate fill time
      await prisma.checkin_sessions.update({
        where: {
          id: sessionId,
        },
        data: {
          session_end_time: new Date(),
          fill_time_seconds: {
            set: Math.floor((new Date() - new Date().setHours(0, 0, 0, 0)) / 1000), // Calculate seconds since midnight
          },
        },
      });

      res.json({ message: "Session ended." });
    } catch (err) {
      console.error("endSession error:", err);
      res.status(500).json({ message: "Server error." });
    }
  },
};
