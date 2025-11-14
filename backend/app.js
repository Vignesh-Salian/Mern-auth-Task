const express = require("express");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

// App setup
const app = express();
app.use(express.json());
app.use(cors());

// ENV variables
const JWT_SECRET = process.env.JWT_SECRET || "MY_SECRET_KEY";
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✓ MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err.message));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model("User", userSchema);

// SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    // check existing
    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ err: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashedPassword
    });

    res.json({
      message: "User registered",
      user: { username: newUser.username }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Signup failed" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ err: "Unauthorized Credentials" });
    }

    // compare passwords
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ err: "Unauthorized Credentials" });
    }

    // generate JWT
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });

  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Login failed" });
  }
});

// AUTH MIDDLEWARE
function authorizeMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ err: "Invalid Authorization" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ err: "Token invalid or expired" });

    req.user = user;
    next();
  });
}

// PROTECTED ROUTE
app.get("/auth", authorizeMiddleware, (req, res) => {
  res.json({
    message: "Authenticated Access",
    user: req.user
  });
});

// SERVER
app.listen(PORT, () => console.log(`✓ Server running on port ${PORT}`));

