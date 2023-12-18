const express = require("express");
const {
  uploadTrailer,
  createMovie,
  removeMovie,
  getMovies,
  getMovieForUpdate,
  updateMovie,
  searchMovies,
  getLatestUploads,
  getSingleMovie,
  getRelatedMovies,
  getTopRatedMovies,
  searchPublicMovies,
} = require("../controllers/movie");
const { isAuth, isAdmin } = require("../middlewares/auth");
const { uploadVideo, uploadImage } = require("../middlewares/multer");
const {
  validateMovie,
  validate,
  validateTrailer,
} = require("../middlewares/validator");
const { parseData } = require("../utils/helper");
const router = express.Router();

//--------------ADMIN Only

// Route to upload a movie trailer
router.post(
  "/upload-trailer",
  isAuth,
  isAdmin,
  uploadVideo.single("video"),
  uploadTrailer
);

// Route to create a movie
router.post(
  "/create",
  isAuth,
  isAdmin,
  uploadImage.single("poster"),
  parseData,
  validateMovie,
  validateTrailer,
  validate,
  createMovie
);

// Route to update a movie
router.patch(
  "/update/:movieId",
  isAuth,
  isAdmin,
  uploadImage.single("poster"),
  parseData,
  validateMovie,
  validate,
  updateMovie
);

// Route to remove a movie
router.delete("/:movieId", isAuth, isAdmin, removeMovie);

// Route to get all movies
router.get("/movies", isAuth, isAdmin, getMovies);

// Route to get movie details for update
router.get("/for-update/:movieId", isAuth, isAdmin, getMovieForUpdate);

// Route to search movies
router.get("/search", isAuth, isAdmin, searchMovies);

//---------------------Normal Users

// Route to get the latest uploaded movies
router.get("/latest-uploads", getLatestUploads);

// Route to get details of a single movie
router.get("/single/:movieId", getSingleMovie);

// Route to get related movies for a given movie
router.get("/related/:movieId", getRelatedMovies);

// Route to get top-rated movies
router.get("/top-rated", getTopRatedMovies);

// Route to search public movies
router.get("/search-public", searchPublicMovies);

module.exports = router;
