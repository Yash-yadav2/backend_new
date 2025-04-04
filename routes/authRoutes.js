const express = require("express");
const { registerUser, loginUser, logoutUser, getUserProfile } = require("../controllers/authController");

const router = express.Router();


  

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/profile", getUserProfile);

module.exports = router;
