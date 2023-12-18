const router = require("express").Router();
const {
  addReview,
  updateReview,
  removeReview,
  getReviewsByMovie,
} = require("../controllers/review");
const { isAuth } = require("../middlewares/auth");
const { validateRatings, validate } = require("../middlewares/validator");

// Route to add a review for a movie
router.post("/add/:movieId", isAuth, validateRatings, validate, addReview);

// Route to update a review
router.patch("/:reviewId", isAuth, validateRatings, validate, updateReview);

// Route to remove a review
router.delete("/:reviewId", isAuth, removeReview);

// Route to get reviews for a specific movie
router.get("/get-reviews-by-movie/:movieId", getReviewsByMovie);

module.exports = router;
