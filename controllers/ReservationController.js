const Reservation = require("../models/Reservation");
const router = require("express").Router();

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
    const reservations = await Reservation.find()
      .populate("flight")
      .populate("user");
    res.status(200).json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving reservations");
  }
});
("");

// Controller function to define a route for creating a new reservation
router.post("/", verifyToken, async (req, res) => {
  try {
    const { user, flight } = req.body;
    const reservation = new Reservation({
      user,
      flight,
      from: flight.from,
      to: flight.to,
      date: flight.date,
      flightNo: flight.flightNo,
      numOfSeats,
      price: flight.price,
    });
    const savedReservation = await reservation.save();
    res.status(201).json(savedReservation);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating reservation");
  }
});

module.exports = router;
