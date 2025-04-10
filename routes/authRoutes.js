const express = require("express");
const { registerUser,loginOrRegisterUser, loginUser, logoutUser, getUserProfile } = require("../controllers/authController");

const router = express.Router();


  

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/loginOrRegisterUser", loginOrRegisterUser);
router.get("/logout", logoutUser);
router.get("/profile", getUserProfile);

module.exports = router;
