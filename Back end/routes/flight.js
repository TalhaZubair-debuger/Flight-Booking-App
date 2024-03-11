const express = require("express");
const flightController = require("../controllers/flight");
const isAuth = require("../middlewares/is-auth");
const { body } = require("express-validator");

const router = express.Router();

router.put(
  "/add-muliple-flights",
  isAuth,
  flightController.putAddMultipleFlights
);

router.put(
  "/add-single-flight",
  isAuth,
  [
    body("flightName")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        const nameRegex = /^[a-zA-Z0-9 ]+$/;
        if (!nameRegex.test(value)) {
          throw new Error("Invalid flight name");
        }
      })
      .withMessage(
        "Flight name is required and must be a string with no special characters."
      ),
    body("planeType")
      .trim()
      .notEmpty()
      .isString()
      .custom((value) => {
        const nameRegex = /^[a-zA-Z0-9 ]+$/;
        if (!nameRegex.test(value)) {
          throw new Error(
            "Plane type is required and must be a string with no special characters."
          );
        }
        return true;
      }),
    body("totalSeats")
      .isNumeric()
      .notEmpty()
      .isInt({ gt: 0 })
      .custom((value) => {
        const numberRegex = /^[0-9]+$/;
        if (!numberRegex.test(value)) {
          throw new Error(
            "Total seats is required and must be a positive number."
          );
        }
        return true;
      }),
    body("totalSeatsEconomy")
      .isNumeric()
      .notEmpty()
      .isInt({ gt: 0 })
      .custom((value) => {
        const numberRegex = /^[0-9]+$/;
        if (!numberRegex.test(value)) {
          throw new Error(
            "Total economy seats is required and must be a positive number."
          );
        }
        return true;
      }),
    body("totalSeatsBusiness")
      .isNumeric()
      .notEmpty()
      .isInt({ gt: 0 })
      .custom((value) => {
        const numberRegex = /^[0-9]+$/;
        if (!numberRegex.test(value)) {
          throw new Error(
            "Total business seats is required and must be a positive number."
          );
        }
        return true;
      }),
    body("vacantSeats")
      .isNumeric()
      .notEmpty()
      .isInt({ gt: -1 })
      .custom((value) => {
        const numberRegex = /^[0-9]+$/;
        if (!numberRegex.test(value)) {
          throw new Error(
            "Vacant seats is required and must be a non-negative number."
          );
        }
        return true;
      }),
    body("flightTime")
      .notEmpty()
      .isISO8601()
      .withMessage("Flight time is required and must be a valid time format."),
    body("flightStops")
      .isArray({ min: 1 })
      .withMessage("Flight stops is required and must be a non-empty array."),
    body().custom(({ totalSeats, totalSeatsEconomy, totalSeatsBusiness }) => {
      if (totalSeatsEconomy + totalSeatsBusiness !== totalSeats) {
        throw new Error(
          "Total economy and business seats must add up to make total flight seats and should be a number."
        );
      }
      return true;
    }),
    body("destination")
      .trim()
      .isString()
      .custom((value) => {
        const nameRegex = /^[a-zA-Z ]+$/;
        if (!nameRegex.test(value)) {
          throw new Error(
            "Destination must be provided, and it must be a string."
          );
        }
        return true;
      }),
    body().custom(({ vacantSeats, totalSeats }) => {
      if (vacantSeats > totalSeats) {
        throw new Error("Vacant seats cannot be more than total seats.");
      }
      return true;
    }),
  ],
  flightController.putAddSingleFlight
);

router.get("/all-flights", flightController.getAllFlights);

router.get("/get-flight/:id", isAuth, flightController.getFlight);

router.post("/search-flights", flightController.postFlightsBySearch)

router.post("/book-seat", isAuth, flightController.postBookSeats);

module.exports = router;
