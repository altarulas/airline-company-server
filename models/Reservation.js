const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  flightId: {
    type: String,
    required: true,
  },
  flightNo: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  numOfSeats: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Reservation", reservationSchema);
