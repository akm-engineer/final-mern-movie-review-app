// Import the mongoose library
const mongoose = require("mongoose");

// Connect to the MongoDB database using the provided URL
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("db is connected"))
  .catch((ex) => console.log("db connection failed" + ex));
