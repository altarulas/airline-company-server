const express = require("express");
const router = express.Router();

const Flight = require("../models/Flight");

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
router.post("/", async (req, res) => {
  try {
    const newFlight = new Flight(req.body);
    const savedFlight = await newFlight.save();
    res.status(201).json(savedFlight);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating flight");
  }
});

module.exports = router;
