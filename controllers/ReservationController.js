const Reservation = require("../models/Reservation");
const express = require("express");
const router = express.Router();

const JWT_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

// Middleware for verifying JWT tokens
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  //console.log(token);
  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  } else {
    try {
      token === JWT_TOKEN && next();
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
("");

// Controller function to define a route for creating a new reservation
// Controller function to define a route for creating a new reservation
router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      userId,
      name,
      surname,
      flightId,
      from,
      to,
      date,
      flightNo,
      price,
      availableSeats,
    } = req.body;
    const reservation = new Reservation({
      userId,
      name,
      surname,
      flightId,
      from,
      to,
      date,
      flightNo,
      price,
      availableSeats,
    });
    const savedReservation = await reservation.save();
    res.status(201).json(savedReservation);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating reservation");
  }
});

module.exports = router;
