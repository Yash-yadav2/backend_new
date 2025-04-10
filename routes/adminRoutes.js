const express = require("express");
const { createUserByAdmin , updateUserRole, deleteUser } = require("../controllers/adminController");
const { isAuthenticated } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const User = require("../models/User");
const { hasRole } = require('../middleware/roleCheck');

const router = express.Router();

router.post("/create-user", createUserByAdmin);

router.get("/users",hasRole('admin'), async (req, res) => {
    try {
      const users = await User.find()
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });
router.put("/users/:id", isAuthenticated, updateUserRole);
router.delete("/users/:id", deleteUser);

module.exports = router;
