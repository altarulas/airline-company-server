const express = require("express");
const router = express.Router();

const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const User = require("../models/User");

// Middleware for verifying JWT tokens
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  //console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  } else {
    try {
      token === process.env.JWT_TOKEN && next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: "Token is invalid" });
    }
  }
};

// Controller function to get all users
router.get("/", verifyToken, async (req, res) => {
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

    if (password !== user.password) {
      return res.status(401).send("Invalid password");
    }

    const token = process.env.JWT_TOKEN;

    // Return the token to the client
    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving user");
  }
});

// Controller function to register a user
router.post("/register", async (req, res) => {
  try {
    const { name, surname, username, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new User({
      name,
      surname,
      username,
      password,
    });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating user");
  }
});

module.exports = router;
