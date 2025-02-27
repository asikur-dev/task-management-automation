const prisma = require("../config/prisma");

module.exports = {
  /**
   * GET company profile
   */
  async getProfile(req, res) {
    try {
      // Ensure this route is only accessible for role='company'
      if (req.role !== "company") {
        return res
          .status(403)
          .json({ message: "Forbidden. Only company admin allowed." });
      }

      const companyId = req.companyId;

      // Fetch the company profile
      const company = await prisma.companies.findUnique({
        where: {
          id: companyId,
        },
        select: {
          id: true,
          company_name: true,
          admin_email: true,
          logo_url: true,
          color_scheme: true,
          subscription_plan: true,
          created_at: true,
          updated_at: true,
        },
      });

      if (!company) {
        return res.status(404).json({ message: "Company not found." });
      }

      res.json(company);
    } catch (err) {
      console.error("getProfile error:", err);
      res.status(500).json({ message: "Server error." });
    }
  },

  /**
   * Update branding or subscription
   */
  async updateProfile(req, res) {
    try {
      // Ensure this route is only accessible for role='company'
      if (req.role !== "company") {
        return res
          .status(403)
          .json({ message: "Forbidden. Only company admin allowed." });
      }

      const companyId = req.companyId;
      const { company_name, logo_url, color_scheme, subscription_plan } = req.body;

      // Update the company profile
      await prisma.companies.update({
        where: {
          id: companyId,
        },
        data: {
          company_name,
          logo_url,
          color_scheme,
          subscription_plan,
        },
      });

      res.json({ message: "Company profile updated successfully." });
    } catch (err) {
      console.error("updateProfile error:", err);
      res.status(500).json({ message: "Server error." });
    }
  },
};
