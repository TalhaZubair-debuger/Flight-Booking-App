const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const flightRoutes = require("./routes/flight");
require("dotenv").config();
const expressWinston = require("express-winston");
const { transports, format } = require("winston");
require("winston-mongodb");

const myFormat = format.printf(({level, meta, timestamp}) => {
  return `${timestamp} ${level} ${JSON.stringify(meta)}`
})

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(
  expressWinston.logger({
    transports: [
      new transports.Console(),
      new transports.File({
        level: "warn",
        filename: "logsWarnings.log",
      }),
      new transports.File({
        level: "error",
        filename: "logsErrors.log",
      }),
      // new transports.MongoDB({
      //   db: process.env.MONGO_URI,
      //   collection: "logs",
      // }),
    ],
    format: format.combine(
      format.json(),
      format.timestamp(),
      myFormat
    ),
    statusLevels: true,
  })
);

//Routes
app.use("/users", userRoutes);
app.use("/flights", flightRoutes);

//Defining acceptable headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS ,GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Connecting MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected!");
    app.listen(8080);
  })
  .catch((err) => console.log(err));

//   Error Handling
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  console.log(status, " and ", message, " and ", data);
  res.status(status).send({ message: message, data: data });
});
