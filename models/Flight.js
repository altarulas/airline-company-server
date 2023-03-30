const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const flightSchema = new Schema({
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
  flightNo: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  availableSeats: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Flight", flightSchema);
