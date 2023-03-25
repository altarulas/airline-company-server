// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import models
const User = require("./models/User");
const Flight = require("./models/Flight");
const Reservation = require("./models/Reservation");

// Create a new Express application
const app = express();

// Setting default API version
const PORT = 3002;
const API_VERSION = "/api/v1";

// Enable cors
app.use(cors());

// Parse JSON requests
app.use(express.json());

// Connect to the MongoDB database
mongoose
  .connect(
    "mongodb+srv://altar:123asd123@my-cluster.cx9jo56.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("db connect successfully");
  })
  .catch((error) => {
    console.log(error);
  });

// Get the users information
app.get(API_VERSION + "/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving users");
  }
});

// Define a route for creating a new user
app.post(API_VERSION + "/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating user");
  }
});

// Get the flights information
app.get(API_VERSION + "/flights", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const flights = await Flight.find().skip(startIndex).limit(limit);
    const count = await Flight.countDocuments();

    const results = {};
    results.currentPage = page;
    results.totalPages = Math.ceil(count / limit);

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

    results.totalCount = count;
    results.data = flights;

    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving flights");
  }
});

// Define a route for creating a new flight
app.post(API_VERSION + "/flights", async (req, res) => {
  try {
    const newFlight = new Flight(req.body);
    const savedFlight = await newFlight.save();
    res.status(201).json(savedFlight);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating flight");
  }
});

// Get the reservations information
app.get(API_VERSION + "/reservations", async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("flight")
      .populate("user");
    res.status(200).json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving reservations");
  }
});

// Define a route for creating a new reservation
app.post(API_VERSION + "/reservations", async (req, res) => {
  try {
    const { user, flight } = req.body;
    const reservation = new Reservation({
      user,
      flight,
      date: flight.date, // updated this line
      flightNo: flight.flightNo, // updated this line
      price: flight.price, // updated this line
    });
    const savedReservation = await reservation.save();
    res.status(201).json(savedReservation);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating reservation");
  }
});

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}${API_VERSION}`);
});
