const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// Controller function to register a user
router.post("/register", async (req, res) => {
  try {
    const { name, surname, username, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      surname,
      username,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating user");
  }
});

// Controller function to get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users");
  }
});

// Controller function to get a user by username and password
router.post("/token", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Invalid password");
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN);

    // Return the token to the client
    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving user");
  }
});

module.exports = router;
