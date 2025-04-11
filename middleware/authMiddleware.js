const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Admins only" });
};

const isFinance = (req, res, next) => {
  if (req.user && req.user.role === "finance") {
    return next();
  }
  res.status(403).json({ message: "Finance only" });
};

const isAdminOrFinance = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "finance")) {
    return next(); 
  }
  res.status(403).json({ message: "Access denied. Admin or Finance only." });
};


module.exports = {
  isAuthenticated,
  isAdmin,
  isFinance,
  isAdminOrFinance,
};
