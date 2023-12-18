const express = require("express");

const {
  create,
  verifyEmail,
  resendEmailVerification,
  forgetPassword,
  sendResetPasswordTokenStatus,
  resetPassword,
  signIn,
} = require("../controllers/user");
const {
  userValiator,
  validate,
  validatePassword,
  signInValidator,
} = require("../middlewares/validator");
const { isValidPassResetTken } = require("../middlewares/user");
const { isAuth } = require("../middlewares/auth.js");
const router = express.Router();
// Route to create a new user
router.post("/create", userValiator, validate, create);

// Route to sign in a user
router.post("/sign-in", signInValidator, validate, signIn);

// Route to verify a user's email
router.post("/verify-email", verifyEmail);

// Route to resend email verification token
router.post("/resend-verify-token", resendEmailVerification);

// Route to initiate the forget password process
router.post("/forget-password", forgetPassword);

// Route to verify a password reset token
router.post(
  "/verify-password-reset-token",
  isValidPassResetTken,
  sendResetPasswordTokenStatus
);

// Route to reset user's password
router.post(
  "/reset-password",
  validatePassword,
  validate,
  isValidPassResetTken,
  resetPassword
);

// Route to check if a user is authenticated
router.get("/is-auth", isAuth, (req, res) => {
  const { user } = req;
  res.json({
    user: {
      id: user._id,

      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      role: user.role,
    },
  });
});

module.exports = router;
