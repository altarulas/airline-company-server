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
  date: String,
  flightNo: String,
  price: String,
});

module.exports = mongoose.model("Reservation", reservationSchema);
