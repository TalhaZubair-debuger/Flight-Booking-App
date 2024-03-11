const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const flightSchema = Schema({
  flightName: {
    type: String,
    required: true,
  },
  planeType: {
    type: String,
    required: true,
  },
  totalSeats: {
    type: Number,
    required: true
  },
  totalSeatsEconomy: {
    type: Number,
    required: true
  },
  totalSeatsBusiness: {
    type: Number,
    required: true
  },
  vacantSeats: {
    type: Number,
    required: true
  },
  flightTime: {
    type: Date,
    required: true
  },
  flightStops: [],
  destination: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Flight", flightSchema);
