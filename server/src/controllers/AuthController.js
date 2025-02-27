const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
require("dotenv").config();

const prisma =  require("../config/prisma");

module.exports = {
  /**
   * Company Admin Login
   * Body: { admin_email, password }
   * Returns: JWT and user details
   */
  async loginCompany(req, res, next) {
    try {
      const { admin_email, password } = req.body;

      // Find company by email
      const company = await prisma.companies.findUnique({
        where: { admin_email },
      });

      if (!company) {
        return next(new AppError("Invalid credentials.", 400));
      }

      // Compare password (support both raw and hashed passwords)
      let isPasswordValid = false;
      if (company.password_hash.startsWith("$2b$")) {
        // Password is hashed (bcrypt format)
        isPasswordValid = await bcrypt.compare(password, company.password_hash);
      } else {
        // Password is stored as plain text (legacy/raw password)
        isPasswordValid = password === company.password_hash;
      }

      if (!isPasswordValid) {
        return next(new AppError("Invalid credentials.", 400));
      }

      // Create JWT
      const token = jwt.sign(
        {
          userId: company.id,
          companyId: company.id,
          role: "company",
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // Return user details along with the token
      return res.json({
        token,
        role: "company",
        user: {
          userId: company.id,
          name: company.company_name,
          email: company.admin_email,
          subscriptionPlan: company.subscription_plan,
          role: "company",
        },
        message: "Login successful.",
      });
    } catch (err) {
      console.error("loginCompany error:", err);
      next(new AppError("Server error", 500));
    }
  },

  /**
   * Company Admin Signup
   * Body: { company_name, admin_email, password, subscription_plan }
   */
  async registerCompany(req, res, next) {
    try {
      const { company_name, admin_email, password, subscription_plan } = req.body;

      if (!company_name || !admin_email || !password) {
        return next(new AppError("Missing required fields.", 400));
      }

      // Check if email already exists
      const existingCompany = await prisma.companies.findUnique({
        where: { admin_email },
      });

      if (existingCompany) {
        return next(new AppError("Email already in use by another company.", 400));
      }

      // Hash password
      const hashedPass = await bcrypt.hash(password, 10);

      // Insert new company
      const newCompany = await prisma.companies.create({
        data: {
          company_name,
          admin_email,
          password_hash: hashedPass,
          subscription_plan: subscription_plan || "Free",
        },
      });

      // Create JWT
      const token = jwt.sign(
        {
          userId: newCompany.id,
          companyId: newCompany.id,
          role: "company",
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" } // Token expires in 1 day
      );

      return res.status(201).json({
        message: "Company registered successfully.",
        token,

        user: {
          userId: newCompany.id,
          name: newCompany.company_name,
          email: newCompany.admin_email,
          subscriptionPlan: newCompany.subscription_plan,
          role: "company",
        },
      });
    } catch (err) {
      console.error("registerCompany error:", err);
      next(new AppError("Server error", 500));
    }
  },

  /**
   * Manager Login
   * Body: { email, password }
   * Returns: JWT and user details
   */
  async loginManager(req, res, next) {
    try {
      const { email, password } = req.body;

      // Find manager by email
      const manager = await prisma.managers.findUnique({
        where: { email },
      });

      if (!manager) {
        return next(new AppError("Invalid credentials.", 400));
      }

      // Check if manager is active
      if (!manager.is_active) {
        return next(new AppError("Manager is deactivated.", 403));
      }

      // Compare password (support both raw and hashed passwords)
      let isPasswordValid = false;
      if (manager.password_hash.startsWith("$2b$")) {
        // Password is hashed (bcrypt format)
        isPasswordValid = await bcrypt.compare(password, manager.password_hash);
      } else {
        // Password is stored as plain text (legacy/raw password)
        isPasswordValid = password === manager.password_hash;
      }

      if (!isPasswordValid) {
        return next(new AppError("Invalid credentials.", 400));
      }

      // Generate JWT
      const token = jwt.sign(
        {
          userId: manager.id,
          role: "manager",
          companyId: manager.company_id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // Return user details along with the token
      return res.json({
        token,
        role: "manager",
        user: {
          userId: manager.id,
          name: manager.name,
          email: manager.email,
          companyId: manager.company_id,
          isActive: manager.is_active,
          role: "manager",
        },
        message: "Manager login successful.",
      });
    } catch (err) {
      console.error("loginManager error:", err);
      next(new AppError("Server error.", 500));
    }
  },
};
