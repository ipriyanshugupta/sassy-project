require("dotenv").config();
const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis-config");

const auth = async (req, res, next) => {
  console.log("cookies: ", req.cookies["token"]);
  console.log("auth: ", req.headers["authorization"]);
  let token;
  if (!req.headers["authorization"] && !req.cookies["token"])
    return res.status(401).json({ error: "Please provide the Auth token." });

  if (req.headers["authorization"]) {
    token = req.headers.authorization.split(" ")[1] || req.headers.authorization ;
  } else if (req.cookies && req.cookies["token"]) {
    token = req.cookies.token;
  }
  if (await redisClient.get(token))
    return res.status(401).json({ error: "Logged out user." });
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({ error: "Unauthorized access." });
    } else {
      console.log("JWT verified successfully", decoded);
      next();
    }
  });
};

module.exports = auth;
