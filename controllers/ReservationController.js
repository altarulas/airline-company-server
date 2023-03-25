const Reservation = require("../models/Reservation");
const router = require("express").Router();

// Controller function to get the reservations information
router.get("/", async (req, res) => {
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

// Controller function to define a route for creating a new reservation
router.post("/", async (req, res) => {
  try {
    const { user, flight } = req.body;
    const reservation = new Reservation({
      user,
      flight,
      date: flight.date,
      flightNo: flight.flightNo,
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
