require("dotenv").config();
const express = require("express");
const redisClient = require("../config/redis-config");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const bcryptData = await bcrypt.compare(password, user.password);
    if (!user || !bcryptData) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ message: "User login successful.", token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Logout
router.post("/logout", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(500).json({ error: "Token not provided." });
    await redisClient.set(token, 'blacklisted');
    res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
