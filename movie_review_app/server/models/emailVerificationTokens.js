const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define email verification token schema
const emailVerificationTokenSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    expires: 3600,
    default: Date.now(),
  },
});

// Hash the token before saving it to the database
emailVerificationTokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    this.token = await bcrypt.hash(this.token, 10);
  }
  next();
});
// Method to compare a given token with the stored hashed token
emailVerificationTokenSchema.methods.compareToken = async function (token) {
  result = await bcrypt.compare(token, this.token);
  return result;
};

module.exports = mongoose.model(
  "EmailVerificationToken",
  emailVerificationTokenSchema
);
