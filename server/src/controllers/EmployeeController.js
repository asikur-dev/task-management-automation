const prisma = require("../config/prisma");
  const moment = require("moment-timezone");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
module.exports = {

  /**
   * List employees for the manager
   */
  async  getEmployees(req, res) {
  try {
    if (req.role !== "manager") {
      return res.status(403).json({ message: "Access denied. Manager only." });
    }

    const managerId = req.userId;

    // Fetch all employees under this manager
    const employees = await prisma.employees.findMany({
      where: {
        manager_id: managerId,
      },
    });

    // Convert UTC times back to local time zone for each employee
    const formattedEmployees = employees.map((employee) => {
      const localCheckInTime = moment.utc(employee.check_in_time, "HH:mm").tz(employee.time_zone).format("HH:mm");
      const localCheckOutTime = moment.utc(employee.check_out_time, "HH:mm").tz(employee.time_zone).format("HH:mm");

      return {
        ...employee,
        check_in_time: localCheckInTime, // Display in local time
        check_out_time: localCheckOutTime, // Display in local time
      };
    });

    res.json(formattedEmployees);
  } catch (err) {
    console.error("getEmployees error:", err);
    res.status(500).json({ message: "Server error." });
  }
  },
  async getEmployeeProfile (req, res) {
    try {
      const employeeId  = req.userId
      const employee = await prisma.employees.findUnique({ where: { id: employeeId } });
      if(!employee){
        return res.status(404).json({ message: "Employee not found." });
      }
      res.json(employee);
    } catch (err) {
      console.error("getEmployeeProfile error:", err);
      res.status(500).json({ message: "Server error." });
  }
  },
  async loginEmployee(req, res){
    try {
      const { email, password } = req.body;

      // Find the employee by email
      const employee = await prisma.employees.findUnique({ where: { email } });

      if (!employee) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      // Compare password (support both raw and hashed passwords)
      let isPasswordValid = false;
      if (employee.password.startsWith("$2b$")) {
        // Password is hashed (bcrypt format)
        isPasswordValid = await bcrypt.compare(password, employee.password);
      } else {
        // Password is stored as plain text (legacy/raw password)
        isPasswordValid = password === employee.password;
      }

      if (!isPasswordValid) {
        // return next(new AppError("Invalid credentials.", 400));
        return res.status(401).json({ message: "Invalid credentials." });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: employee.id, role: "employee" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // Authentication successful
      res.status(200).json({ message: "Login successful.",user:{...employee,role:"employee"},token });
    } catch (err) {
      console.error("loginEmployee error:", err);
      res.status(500).json({ message: "Server error." });
    }
  },

  /**
   * Create a new employee under this manager
   */

async  createEmployee(req, res) {
  try {
    if (req.role !== "manager") {
      return res.status(403).json({ message: "Access denied. Manager only." });
    }

    const managerId = req.userId;
    const { name, email, password, time_zone, check_in_time, check_out_time } = req.body;
    const existingEmployee = await prisma.employees.findUnique({
      where: {
        email,
      },
    });
    if (existingEmployee) {
      return res.status(400).json({ message: "Employee with this email already exists." });
    }

    // Validate time format
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Matches HH:mm
    if (!timeRegex.test(check_in_time) || !timeRegex.test(check_out_time)) {
      return res.status(400).json({ message: "Invalid time format. Use HH:mm." });
    }

    // Convert local time to UTC
    const utcCheckInTime = moment.tz(`${check_in_time}`, "HH:mm", time_zone).utc().format("HH:mm");
    const utcCheckOutTime = moment.tz(`${check_out_time}`, "HH:mm", time_zone).utc().format("HH:mm");
    const hashedpassword = await bcrypt.hash(password, 10);
    // Insert the new employee with UTC times
    await prisma.employees.create({
      data: {
        manager_id: managerId,
        name,
        password:hashedpassword,
        email,
        time_zone,
        check_in_time: utcCheckInTime, // Save as UTC time
        check_out_time: utcCheckOutTime, // Save as UTC time
      },
    });

    res.status(201).json({ message: "Employee created successfully." });
  } catch (err) {
    console.error("createEmployee error:", err);
    res.status(500).json({ message: "Server error." });
  }
},
  /**
   * Update an employee
   */
  async updateEmployee(req, res) {
  try {
    if (req.role !== "manager") {
      return res.status(403).json({ message: "Access denied. Manager only." });
    }

    const managerId = req.userId;
    const employeeId = req.params.id;
    const { name, email,password, time_zone, check_in_time, check_out_time } = req.body;

    // Verify the employee belongs to the manager
    const employee = await prisma.employees.findUnique({
      where: {
        id: employeeId,
        manager_id: managerId,
      },
    });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found for this manager." });
    }

    // Validate time format
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Matches HH:mm
    if (!timeRegex.test(check_in_time) || !timeRegex.test(check_out_time)) {
      return res.status(400).json({ message: "Invalid time format. Use HH:mm." });
    }

    // Convert local time to UTC
    const utcCheckInTime = moment.tz(`${check_in_time}`, "HH:mm", time_zone).utc().format("HH:mm");
    const utcCheckOutTime = moment.tz(`${check_out_time}`, "HH:mm", time_zone).utc().format("HH:mm");


    const hashedpassword = await bcrypt.hash(password, 10);
    // Update the employee details with UTC times
    await prisma.employees.update({
      where: {
        id: employeeId,
      },
      data: {
        name,
        email,
        password:password?hashedpassword:employee.password,
        time_zone,
        check_in_time: utcCheckInTime, // Save as UTC time
        check_out_time: utcCheckOutTime, // Save as UTC time
      },
    });

    res.json({ message: "Employee updated successfully." });
  } catch (err) {
    console.error("updateEmployee error:", err);
    res.status(500).json({ message: "Server error." });
  }
},

  /**
   * Delete an employee
   */
  async deleteEmployee(req, res) {
    try {
      if (req.role !== "manager") {
        return res.status(403).json({ message: "Access denied. Manager only." });
      }

      const managerId = req.userId;
      const employeeId = req.params.id;

      // Verify the employee belongs to the manager
      const employee = await prisma.employees.findUnique({
        where: {
          id: employeeId,
          manager_id: managerId,
        },
      });

      if (!employee) {
        return res.status(404).json({ message: "Employee not found for this manager." });
      }

      // Delete the employee
      await prisma.employees.delete({
        where: {
          id: employeeId,
        },
      });

      res.json({ message: "Employee deleted successfully." });
    } catch (err) {
      console.error("deleteEmployee error:", err);
      res.status(500).json({ message: "Server error." });
    }
  },


};
