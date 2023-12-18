const { isValidObjectId } = require("mongoose");
const PasswordResetToken = require("../models/passwordResetToken");
const { sendError } = require("../utils/helper");

// Middleware to check the validity of the password reset token
exports.isValidPassResetTken = async (req, res, next) => {
  const { token, userId } = req.body;

  if (!token.trim() || !isValidObjectId(userId))
    return sendError(res, "Invalid request");

  // Find the password reset token in the database for the specified user
  const resetToken = await PasswordResetToken.findOne({ owner: userId });
  if (!resetToken)
    return sendError(res, "Unauthorised access, invalid request!!");

  const matched = await resetToken.compareToken(token);
  if (!matched) return sendError(res, "Unauthorised access, invalid request");

  req.resetToken = resetToken;
  next();
};
