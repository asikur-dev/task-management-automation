/**
 * This middleware checks for "Authorization: Bearer <token>".
 * It verifies the token and attaches companyId or managerId to `req`.
 *
 * We'll assume that the 'role' claim in the token can be "company" or "manager"
 * for differentiating the type of user. Adjust as needed.
 */

const jwt = require("jsonwebtoken");
module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided." });
  }

  const token = authHeader.split(" ")[1];
  try {
    
    

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // For example, you might store:
    // { userId: 5, role: 'company', companyId: 1 } in the token
    req.userId = decoded.userId;
    req.role = decoded.role;
      req.companyId = decoded.companyId || null;
      // req.managerId = decoded.managerId || null;
    // If manager, you might decode managerId as well

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token. Please log in." });
  }
};
