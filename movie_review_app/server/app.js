const express = require("express");
require("express-async-errors");
const morgan = require("morgan"); // Logging middleware
const { errorHandler } = require("./middlewares/error");
const cors = require("cors"); // CORS middleware
// const path = require("path");

require("dotenv").config();
require("./db"); // Connect to the database
const userRouter = require("./routes/user");
const actorRouter = require("./routes/actor");
const movieRouter = require("./routes/movie");
const reviewRouter = require("./routes/review");
const adminRouter = require("./routes/admin");

const { handleNotFound } = require("./utils/helper");

const app = express();
app.use(cors()); //solving CORS error
app.use(express.json()); // for parsing application/json
app.use(morgan("dev")); // Logging HTTP requests in development mode
app.use("/api/user", userRouter);
app.use("/api/actor", actorRouter);
app.use("/api/movie", movieRouter);
app.use("/api/review", reviewRouter);
app.use("/api/admin", adminRouter);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/*", handleNotFound);
app.use(errorHandler);

// app.use(express.static(path.join(__dirname, "../app/build")));
// app.get("*", function (_, res) {
//   res.sendFile(path.join(__dirname, "../app/build/index.html"), function (err) {
//     res.status(500).send(err);
//   });
// });

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
