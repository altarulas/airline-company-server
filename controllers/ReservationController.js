const Reservation = require("../models/Reservation");
const express = require("express");
const router = express.Router();

// Middleware for verifying JWT tokens
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
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

// Controller function to get the reservations information
router.get("/", verifyToken, async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.status(200).json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving reservations");
  }
});

// Controller function to define a route for creating a new reservation
router.post("/", verifyToken, async (req, res) => {
  try {
    const reservation = await Reservation.create(req.body);
    res.status(201).json(reservation);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating reservation");
  }
});

module.exports = router;
