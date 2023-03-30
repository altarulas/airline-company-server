const express = require("express");
const router = express.Router();

const Flight = require("../models/Flight");

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

// Controller function to get flights with pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const flights = await Flight.find().skip(startIndex).limit(limit);
    const count = await Flight.countDocuments();

    const results = {};

    if (endIndex < count) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    results.results = flights;

    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving flights");
  }
});

// Controller function to define a route for creating a new flight
router.post("/", verifyToken, async (req, res) => {
  try {
    const newFlight = new Flight(req.body);
    const savedFlight = await newFlight.save();
    res.status(201).json(savedFlight);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating flight");
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);

    if (!flight) {
      return res.status(404).send("Flight not found");
    }

    flight.availableSeats = req.body.availableSeats;
    const updatedFlight = await flight.save();

    res.status(200).json(updatedFlight);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating flight");
  }
});

module.exports = router;
