const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const seatSchema = Schema({
  seatNumber: {
    type: Number,
    required: true,
  },
  seatType: {
    type: String,
    required: true,
  },
  bookingStatus: {
    type: Boolean,
    required: true,
  },
  FlightId: {
    type: Schema.Types.ObjectId,
    ref: "Flight",
    required: true,
  },
  OwnerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: false,
  }
});

module.exports = mongoose.model("Seat", seatSchema);
