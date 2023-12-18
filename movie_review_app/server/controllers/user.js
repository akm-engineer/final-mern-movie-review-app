const jwt = require("jsonwebtoken");
const User = require("../models/user");
const EmailVerificationToken = require("../models/emailVerificationTokens");
const { isValidObjectId } = require("mongoose");
const { generateOTP, generateMailTransporter } = require("../utils/mail");
const { sendError, generateRandomBytes } = require("../utils/helper");
const PasswordResetToken = require("../models/passwordResetToken");
const PASSWORD_URL = process.env.PASSWORD_URL;

// Controller to create a new user
exports.create = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the email already exists
  const oldUser = await User.findOne({ email });
  if (oldUser) return sendError(res, "This email already exists");

  // Create a new user
  const newUser = new User({ name, email, password });
  await newUser.save();

  // Generate 6-Digit OTP and store it in the database
  let OTP = generateOTP();
  const newVerificationToken = new EmailVerificationToken({
    owner: newUser._id,
    token: OTP,
  });
  await newVerificationToken.save();

  // Send the OTP to the user's email
  var transport = generateMailTransporter();
  transport.sendMail({
    from: "verification@reviewapp.com",
    to: newUser.email,
    subject: "Email Verification",
    html: `
    <p>Your Verification OTP</p>
    <p>${OTP}</p>
    `,
  });

  // Respond with user information
  res.status(201).json({
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
};
// Controller to verify user email
exports.verifyEmail = async (req, res) => {
  const { userId, OTP } = req.body;

  // Validate user ID
  if (!isValidObjectId(userId)) return sendError(res, "Invalid User");

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) return sendError(res, "User not found!!", 404);

  // Check if the account is already verified
  if (user.isVerified) return sendError(res, "Account already verified!! ");

  // Find the verification token for the user
  const token = await EmailVerificationToken.findOne({ owner: userId });
  if (!token) return sendError(res, "Token not found");

  // Compare the provided OTP with the stored one
  const isMatched = await token.compareToken(OTP);
  if (!isMatched) return sendError(res, "Please enter the valid OTP");

  // Mark the user as verified
  user.isVerified = true;
  await user.save();

  // Delete the verification token
  await EmailVerificationToken.findByIdAndDelete(token._id);

  // Send a welcome email to the user
  var transport = generateMailTransporter();
  transport.sendMail({
    from: "verification@reviewapp.com",
    to: user.email,
    subject: "Welcome Email ",
    html: `
    <h1>Welcome to our app and thanks for choosing us...</h1>
    `,
  });

  // Generate a JWT token for the user
  const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  // Respond with user information and a success message
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      token: jwtToken,
      isVerified: user.isVerified,
      role: user.role,
    },
    message: "Your email is verified",
  });
};

// Controller to resend email verification
exports.resendEmailVerification = async (req, res) => {
  const { userId } = req.body;

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) return sendError(res, "User not found!!");

  // Check if the account is already verified
  if (user.isVerified) return sendError(res, "Already Verified...");

  // Check if there is already a verification token
  const alreadyHasToken = await EmailVerificationToken.findOne({
    owner: userId,
  });

  if (alreadyHasToken)
    return sendError(res, "Wait for a hour to get another OTP");

  //Generate 6-Digit OTP
  let OTP = generateOTP();
  //storing on db
  const newVerificationToken = new EmailVerificationToken({
    owner: user._id,
    token: OTP,
  });
  await newVerificationToken.save();

  //send new otp to user email
  var transport = generateMailTransporter();
  transport.sendMail({
    from: "verification@reviewapp.com",
    to: user.email,
    subject: "Email Verification",
    html: `
    <p>Your Verification OTP</p>
    <p>${OTP}</p>
    `,
  });

  //Success Message
  res.json({
    message: "New OTP has been sent to your registered email accout.",
  });
};

// Controller for initiating the password reset process
exports.forgetPassword = async (req, res) => {
  const { email } = req.body;

  // Check if the email is provided
  if (!email) return sendError(res, "Email is missing");

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) return sendError(res, "User not found", 404);

  // Check if there is already a password reset token
  const alreadyHasToken = await PasswordResetToken.findOne({ owner: user._id });
  if (alreadyHasToken)
    return sendError(res, "Only after a hour you can request for new token");

  // Generate a new token and store it
  const token = await generateRandomBytes();
  const newPasswordResetToken = await PasswordResetToken({
    owner: user._id,
    token,
  });
  await newPasswordResetToken.save();

  // Construct the reset password URL
  const resetPasswordUrl = `${PASSWORD_URL}/auth/reset-password?token=${token}&id=${user._id}`;

  // Send an email to the user with the reset password link
  const transport = generateMailTransporter();

  transport.sendMail({
    from: "security@reviewapp.com",
    to: user.email,
    subject: "Reset Password",
    html: `
    <p>Click here to reset password</p>
    <a href=${resetPasswordUrl}>Reset Password</a>
    `,
  });

  // Respond with a success message
  res.json({ message: "Link send to your email" });
};

// Controller to check the status of the password reset token
exports.sendResetPasswordTokenStatus = (req, res) => {
  res.json({ valid: true });
};

// Controller to reset user password
exports.resetPassword = async (req, res) => {
  const { newPassword, userId } = req.body;

  // Find the user by ID
  const user = await User.findById(userId);

  // Check if the new password is different from the old one
  const matched = await user.comparePassword(newPassword);
  if (matched)
    return sendError(res, "New password must be different from old one");

  // Set the new password and save the user
  user.password = newPassword;
  await user.save();

  // Delete the password reset token
  await PasswordResetToken.findByIdAndDelete(req.resetToken._id);
  // Send an email to the user confirming the password reset
  const transport = generateMailTransporter();

  transport.sendMail({
    from: "security@reviewapp.com",
    to: user.email,
    subject: "Reset Password successfully",
    html: `
    <h1>Reset Password successfully</h1>
    <p >Now you can use new password</p>
    `,
  });

  // Respond with a success message
  res.json({
    message: "Password reset successfully, now you can use your new password",
  });
};

// Controller to handle user sign-in
exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) return sendError(res, "Email/password mismatch");

  // Compare the provided password with the stored one
  const matched = await user.comparePassword(password);
  if (!matched) return sendError(res, "Email/password mismatch");

  // Extract relevant user information
  const { _id, name, role, isVerified } = user;

  // Generate a JWT token for the user
  const jwtToken = jwt.sign({ userId: _id }, process.env.JWT_SECRET);

  // Respond with user information and the JWT token
  res.json({
    user: { id: _id, name, role, email, token: jwtToken, isVerified },
  });
};
