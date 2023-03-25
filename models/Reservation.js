const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
  user: {
    // updated this line
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  flight: {
    type: Schema.Types.ObjectId,
    ref: "Flight",
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
  flightNo: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Reservation", reservationSchema);
