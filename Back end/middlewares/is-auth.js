const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not Authorized");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "thisisthesecretkey");

    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    error.statusCode = 401;
    error.message = "Not authenticated!";
    next(error);
  }
};
