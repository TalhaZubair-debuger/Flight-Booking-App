const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

exports.putSignUpUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    res.status(422).send({
      message: `${errors.array()[0].msg}`,
    });
    return;
  }

  const { fullName, email, number, password } = req.body;

  try {
    let body;

    const hashedPassword = await bcrypt.hash(password, 12);

    if (!email && !number) {
      res.status(406).send({ message: "Email or phone number is required" });
      return;
    }

    if (email) {
      const checkUser = await User.findOne({ email });
      if (checkUser) {
        res
          .status(409)
          .send({ message: "User with this email already exists!" });
        return;
      }
      body = {
        fullName,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
      };
    }

    if (number) {
      const checkUser = await User.findOne({ number });
      if (checkUser) {
        res
          .status(409)
          .send({ message: "User with this phone number already exists!" });
        return;
      }
      body = {
        fullName,
        number,
        password: hashedPassword,
      };
    }

    const user = new User(body);
    const result = await user.save();
    res.status(201).send({ message: "User Created!", userId: result._id });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postLoginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    res.status(422).send({
      message: `${errors.array()[0].msg}`,
    });
    return;
  }

  const email = req.body.email ? req.body.email.trim().toLowerCase() : "";
  const number = req.body.number ? req.body.number : 0;
  const password = req.body.password;

  try {
    let user;
    if (number === 0) {
      user = await User.findOne({ email });
    }
    if (email === "") {
      user = await User.findOne({ number });
    }
    if (!user) {
      res
        .status(404)
        .send({ message: "User doesn't exist with this email/number!" });
      return;
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      res.status(401).send({ message: "Wrong Password!" });
      return;
    }

    let token;
    if (number === 0) {
      token = jwt.sign(
        {
          email: user.email,
          userId: user._id.toString(),
        },
        "thisisthesecretkey",
        { expiresIn: "5h" }
      );
    }
    if (email === "") {
      token = jwt.sign(
        {
          number: user.number,
          userId: user._id.toString(),
        },
        "thisisthesecretkey",
        { expiresIn: "5h" }
      );
    }
    res.status(200).json({ token: token, userId: user._id.toString() });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select("fullName email").lean();

    if (!user) {
      res.status(404).send({ message: "No requested user found!" });
      return;
    }

    // Create a new object with only the desired fields
    const userResponse = {
      fullName: user.fullName,
      email: user.email,
    };

    res.status(200).send({ user: userResponse });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
