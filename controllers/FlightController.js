const express = require("express");
const router = express.Router();

const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

const Flight = require("../models/Flight");

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

// Controller function to get flights with pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
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

// Controller function to get a specific flight by id
router.get("/:id", async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).send("Flight not found");
    }
    res.status(200).json(flight);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving flight");
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
    // update the flight data with the data sent in the request body
    flight.flightNo = req.body.flightNo;
    flight.from = req.body.from;
    flight.to = req.body.to;
    flight.date = req.body.date;
    flight.price = req.body.price;
    flight.availableSeats = req.body.availableSeats;

    const updatedFlight = await flight.save();
    res.status(200).json(updatedFlight);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating flight");
  }
});

module.exports = router;
