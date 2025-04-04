const express = require("express");
const { getAllUsers, updateUserRole, deleteUser } = require("../controllers/adminController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const User = require("../models/User");

const router = express.Router();

router.get("/users",isAdmin, async (req, res) => {
    try {
      const users = await User.find().select("-password"); // Exclude password
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });
router.put("/users/:id", isAuthenticated, updateUserRole);
router.delete("/users/:id", isAuthenticated, deleteUser);

module.exports = router;
