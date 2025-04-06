const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();


// CORS Configuration

const allowedOrigins = ["https://casibom8870.com","https://oc0000ad.com", "https://xn--casiom820-jy5d.com" ,"https://pfoc0000ft.com"];


app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies and sessions
  })
);

// Handle preflight requests
app.options("*", cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("trust proxy", 1);

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {   secure: process.env.NODE_ENV === "production", httpOnly: true , sameSite: "lax",maxAge: 1000 * 60 * 60 * 24}, // Adjust for HTTPS
  })
);

// Initialize Passport.js
require("./config/passportConfig");
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/finance", require("./routes/financeRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/companyaccount", require("./routes/companyAccountRoutes"));

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// Serve React frontend (if applicable)
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

// Start Server
module.exports = app;
