const User = require("../models/User");
const passport = require("passport");

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, countryCode, role } = req.body;

    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate a username by combining firstName and lastName
    const username = `${firstName.trim()}${lastName.trim()}`;

    // Default role to "user" if not provided
    const userRole = role || "user";

    // Create the user
    const user = new User({
      username,
      firstName,
      lastName,
      email,
      password, // Store as plain text as per your schema
      phone,
      countryCode,
      role: userRole,
    });

    await user.save();


    return res.status(201).json({
      message: "User registered successfully",
      user,
    });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


const loginUser = (req, res, next) => {
  console.log("Login request body:", req.body);
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) {
      console.log("Authentication failed:", info);
      return res.status(400).json({ message: info?.message || "Invalid credentials" });
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) return res.status(500).json({ error: loginErr.message });
      req.session.user = user;
      res.json({ message: "Login successful", user });
    });
  })(req, res, next);
};


const logoutUser = (req, res) => {
  req.logout(() => {
    res.json({ message: "Logout successful" });
  });
};

const getUserProfile = (req, res) => {
  if (!req.isAuthenticated())
    return res.status(401).json({ message: "Unauthorized" });
  res.json(req.user);
};

module.exports = { registerUser, loginUser, logoutUser, getUserProfile };
