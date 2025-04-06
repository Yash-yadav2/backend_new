const User = require("../models/User");
const passport = require("passport");

const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      countryCode,
      role,
      address,
      birthdate,
      gender,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const username = `${firstName.trim()}${lastName.trim()}${Date.now()}`;

    const newUser = new User({
      username,
      firstName,
      lastName,
      email,
      role: role || "user",
      phone,
      countryCode,
      address,
      birthdate,
      gender,
    });

    await User.register(newUser, password); // hashes password

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const loginUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(400).json({ message: info?.message || "Invalid credentials" });

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
