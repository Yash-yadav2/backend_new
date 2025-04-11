const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();


const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      countryCode,
      address,
      birthdate,
      gender,
      role,
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const username = `${firstName}${lastName}${Date.now()}`;

    const user = await User.create({
      username,
      firstName,
      lastName,
      email,
      password,
      phone,
      countryCode,
      address,
      birthdate,
      gender,
      role,
    });

    const token = generateToken(user._id);

    res.status(201).json({ message: "Registered Successfully!", token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(user._id);

    res.json({ message: "Login successfully!", token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
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
