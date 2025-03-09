const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware"); 

router.get("/", async (req, res) => {
  try {
    const { username } = req.query;  

    let users;
    if (username) {
      users = await User.find({ username: { $regex: username, $options: 'i' } }, 'username email medicines');  // Case-insensitive search
    } else {
      users = await User.find({}, 'username email medicines');
    }
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);  
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
