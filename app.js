// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Create a new Express application
const app = express();

// Setting default API version and port number
const PORT = process.env.PORT || 3002;
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

// Importing the User controller
const UserController = require("./controllers/UserController");
app.use(API_VERSION + "/users", UserController);

// Importing the Flight controller
const FlightController = require("./controllers/FlightController");
app.use(API_VERSION + "/flights", FlightController);

// Importing the Reservation controller
const ReservationController = require("./controllers/ReservationController");
app.use(API_VERSION + "/reservations", ReservationController);

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}${API_VERSION}`);
});
