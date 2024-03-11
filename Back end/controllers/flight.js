const Flight = require("../models/flight");
const Seat = require("../models/seat");
const { validationResult } = require("express-validator");

exports.putAddMultipleFlights = async (req, res, next) => {
  const flights = req.body;

  const validationErrors = [];

  flights.forEach((flight, index) => {
    const errors = {};

    if (!flight.flightName || typeof flight.flightName !== "string") {
      errors.flightName = "Flight name is required and must be a string.";
    }

    if (!flight.planeType || typeof flight.planeType !== "string") {
      errors.planeType = "Plane type is required and must be a string.";
    }

    if (
      !flight.totalSeats ||
      typeof flight.totalSeats !== "number" ||
      flight.totalSeats <= 0
    ) {
      errors.totalSeats =
        "Total seats is required and must be a positive number.";
    }

    if (
      !flight.totalSeatsEconomy ||
      typeof flight.totalSeatsEconomy !== "number" ||
      flight.totalSeatsEconomy <= 0
    ) {
      errors.totalSeatsEconomy =
        "Total economy seats is required and must be a positive number.";
    }

    if (
      !flight.totalSeatsBusiness ||
      typeof flight.totalSeatsBusiness !== "number" ||
      flight.totalSeatsBusiness <= 0
    ) {
      errors.totalSeatsBusiness =
        "Total business seats is required and must be a positive number.";
    }

    if (
      !flight.vacantSeats ||
      typeof flight.vacantSeats !== "number" ||
      flight.vacantSeats < 0
    ) {
      errors.vacantSeats =
        "Vacant seats is required and must be a non-negative number.";
    }

    if (!flight.flightTime) {
      errors.flightTime =
        "Flight time is required and must be a valid time format.";
    }

    if (
      !flight.flightStops ||
      !Array.isArray(flight.flightStops) ||
      flight.flightStops.length === 0
    ) {
      errors.flightStops =
        "Flight stops is required and must be a non-empty array.";
    }

    if (
      flight.totalSeatsEconomy + flight.totalSeatsBusiness !==
      flight.totalSeats
    ) {
      errors.totalSeats =
        "total economy and business seats must sum upto total seats";
    }

    if (flight.vacantSeats > flight.totalSeats) {
      errors.vacantSeats = "Vacant seats cant be more than total seats";
    }

    if (!flight.destination) {
      errors.destination = "Flight destination must be provided.";
    }

    // Add other validation checks for each field

    if (Object.keys(errors).length > 0) {
      validationErrors.push({ index, errors });
      return;
    }

    console.log(`Flight data for flight ${index + 1} is Ok!`);
  });

  if (validationErrors.length > 0) {
    res
      .status(406)
      .send({ message: "Invalid input format!", validationErrors });
    return;
  }

  try {
    //Insert Flights
    const addedFlights = await Flight.insertMany(flights);

    const seatsToAdd = [];
    addedFlights.forEach((flight) => {
      for (let i = 1; i <= flight.totalSeatsEconomy; i++) {
        seatsToAdd.push({
          seatNumber: i,
          seatType: "Economy",
          bookingStatus: false,
          FlightId: flight._id,
        });
      }

      for (let i = 1; i <= flight.totalSeatsBusiness; i++) {
        seatsToAdd.push({
          seatNumber: i,
          seatType: "Business",
          bookingStatus: false,
          FlightId: flight._id,
        });
      }
    });

    // Insert seats
    const addedSeats = await Seat.insertMany(seatsToAdd);

    res.status(201).send({ flights: addedFlights, seats: addedSeats });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.putAddSingleFlight = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    res.status(422).send({
      message: `${errors.array()[0].msg}`,
    });
    return;
  }

  const {
    flightName,
    planeType,
    totalSeats,
    totalSeatsEconomy,
    totalSeatsBusiness,
    vacantSeats,
    flightTime,
    flightStops,
    destination,
  } = req.body;

  try {
    // Insert Flight
    const addedFlight = await Flight.create({
      flightName,
      planeType,
      totalSeats,
      totalSeatsEconomy,
      totalSeatsBusiness,
      vacantSeats,
      flightTime,
      flightStops,
      destination,
    });

    const seatsToAdd = [];

    // Insert Economy seats
    for (let i = 1; i <= totalSeatsEconomy; i++) {
      seatsToAdd.push({
        seatNumber: i,
        seatType: "Economy",
        bookingStatus: false,
        FlightId: addedFlight._id,
      });
    }

    // Insert Business seats
    for (let i = 1; i <= totalSeatsBusiness; i++) {
      seatsToAdd.push({
        seatNumber: i,
        seatType: "Business",
        bookingStatus: false,
        FlightId: addedFlight._id,
      });
    }

    // Insert seats
    const addedSeats = await Seat.insertMany(seatsToAdd);

    res.status(201).send({ flight: addedFlight, seats: addedSeats });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getAllFlights = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1; //To be set in Front end
    const skip = (page - 1) * limit;

    const flights = await Flight.find().skip(skip).limit(limit);

    res.status(200).send({ flights });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getFlight = async (req, res, next) => {
  const flightId = req.params.id;
  try {
    const flight = await Flight.findById(flightId);
    if (!flight) {
      res.status(404).send({ message: "Flight not found!" });
      return;
    }

    const seats = await Seat.find({ FlightId: flightId });

    res.status(200).send({ flight, seats });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postFlightsBySearch = async (req, res, next) => {
  const { flightNames, planeTypes, flightStops } = req.body;

  const conditions = [];

  if (flightNames && flightNames !== "") {
    conditions.push({ flightName: { $regex: new RegExp(flightNames, 'i') } });
  }

  if (flightStops && flightStops !== "") {
    conditions.push({ destination: { $regex: new RegExp(flightStops, 'i') } });
    conditions.push({ flightStops: { $regex: new RegExp(flightStops, 'i') } });
  }

  if (planeTypes && planeTypes !== "") {
    conditions.push({ planeType: { $regex: new RegExp(planeTypes, 'i') } });
  }

  // Use the conditions array in the query
  let flights;
  try {
    flights = await Flight.find({
      $or: conditions
    });

    res.status(200).send({ flights });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};


exports.postBookSeats = async (req, res, next) => {
  const flightIds = req.body;

  try {
    let updatedSeat;
    for (let i = 0; i < flightIds.length; i++) {
      updatedSeat = await Seat.findById(flightIds[i]);

      const flight = await Flight.findById(updatedSeat.FlightId);
      if (flight.vacantSeats <= 0) {
        res.status(200).send({ message: "no more vacant seats available! " });
        return;
      }

      if (!updatedSeat) {
        res.status(404).send({ message: "Couldn't find seat(s) you booked!" });
        return;
      }

      updatedSeat.bookingStatus = true;
      updatedSeat.OwnerId = req.userId;
      await updatedSeat.save();

      if (updatedSeat) {
        flight.vacantSeats -= 1;
        await flight.save();
      }
    }

    res.status(201).send({ message: "Seat(s) booked" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
