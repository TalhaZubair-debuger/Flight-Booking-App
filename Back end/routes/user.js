const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/user");
const isAuth = require("../middlewares/is-auth");
const User = require("../models/user");

const router = express.Router();

router.put(
  "/signup",
  [
    body("fullName")
      .trim()
      .custom((value) => /^[a-zA-Z ]+$/.test(value))
      .withMessage(
        "FullName must be a string containing no digits and special characters, but can include spaces."
      ),
    body("email")
      .optional()
      .isEmail()
      .trim()
      .custom(async (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          throw new Error("Invalid email address");
        }
        const lastThreeCharacters = value.substr(value.length - 3);
        console.log(lastThreeCharacters);
        if (lastThreeCharacters !== "com"){
          throw new Error("Email can't contain last three characters other than 'com'.")
        }
        const existingUser = await User.findOne({ email: value });
        if (existingUser) {
          throw new Error("A user already exists with this e-mail address");
        }
      }),
    body("number")
      .optional()
      .trim()
      .isInt({ min: 1000000000, max: 999999999999 })
      .withMessage("Invalid phone number. min length 10"),
    body("password")
      .trim()
      .custom((value) => {
        if (value.length < 5) {
          throw new Error("Please enter a password of minimum length 5");
        }
        return true;
      }),
  ],
  userController.putSignUpUser
);

router.post(
  "/login",
  [
    body("email")
      .optional()
      .trim()
      .isEmail()
      .withMessage("Invalid email address"),
    body("number")
      .optional()
      .trim()
      .isInt({ min: 1000000000, max: 999999999999 })
      .withMessage("Invalid phone number. min length 10"),
    body("password")
      .trim()
      .custom((value) => {
        if (value.length < 5) {
          throw new Error("Please enter a password of minimum length 5");
        }
        return true;
      }),
  ],
  userController.postLoginUser
);

router.get("/get-user", isAuth, userController.getUser);

module.exports = router;
