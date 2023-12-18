const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/helper");
const User = require("../models/user");

// Middleware to check if the user is authenticated
exports.isAuth = async (req, res, next) => {
  // Extract the token from the request headers
  const token = req.headers?.authorization;

  // Check if the token is missing
  if (!token) return sendError(res, "Invalid token!");

  // Extract the JWT token from the "Bearer" token format
  const jwtToken = token.split("Bearer ")[1];

  // Check if the JWT token is missing
  if (!jwtToken) return sendError(res, "Invalid token!");

  // Verify the JWT token using the secret key
  const decode = jwt.verify(jwtToken, process.env.JWT_SECRET);
  const { userId } = decode;

  // Find the user by the decoded user ID
  const user = await User.findById(userId);

  // Check if the user exists
  if (!user) return sendError(res, "unauthorized access!");

  // Attach the user object to the request for further use
  req.user = user;

  // Move to the next middleware
  next();
};

// Middleware to check if the user is an admin
exports.isAdmin = (req, res, next) => {
  // Extract the user from the request
  const { user } = req;

  // Check if the user's role is not admin
  if (user.role !== "admin") return sendError(res, "unauthorized access!");

  // Move to the next middleware
  next();
};
