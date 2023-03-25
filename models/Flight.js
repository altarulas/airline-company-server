const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const flightSchema = new Schema({
  date: String,
  flightNo: String,
  price: String,
  availableSeats: String,
});

module.exports = mongoose.model("Flight", flightSchema);
