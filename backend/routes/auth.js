const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { generateToken } = require("../config/jwt");
const User = require("../models/User");

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, medicineName, dosage, days } = req.body;

    if (!username || !email || !password ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    console.log("User created:", newUser);

    const token = generateToken(newUser._id);
    res.status(201).json({ message: "User created successfully", token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({ message: "Login successful", token, userId: user._id});
  } catch (err) {
    console.log("Error from login", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
