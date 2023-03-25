const express = require("express");
const router = express.Router();

const User = require("../models/User");

// Controller function to get the users information
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users");
  }
});

// Controller function to define a route for creating a new user
router.post("/", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating user");
  }
});

module.exports = router;
