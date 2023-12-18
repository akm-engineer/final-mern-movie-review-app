const Movie = require("../models/movie");
const Review = require("../models/review");
const User = require("../models/user");
const {
  getAverageRatings,
  topRatedMoviesPipeline,
} = require("../utils/helper");

// Controller to get information about the app (total movies, reviews, and users)
exports.getAppInfo = async (req, res) => {
  // Count the number of documents in each collection
  const movieCount = await Movie.countDocuments();
  const reviewCount = await Review.countDocuments();
  const userCount = await User.countDocuments();

  // Respond with the app information
  res.json({ appInfo: { movieCount, reviewCount, userCount } });
};

// Controller to get the most-rated movies
exports.getMostRated = async (req, res) => {
  // Aggregate the top-rated movies using a custom pipeline
  const movies = await Movie.aggregate(topRatedMoviesPipeline());

  // Map each movie to include average ratings information
  const mapMovies = async (m) => {
    const reviews = await getAverageRatings(m._id);

    // Return formatted movie information
    return {
      id: m._id,
      title: m.title,
      reviews: { ...reviews },
    };
  };

  // Process movies in parallel using Promise.all
  const topRatedMovies = await Promise.all(movies.map(mapMovies));

  // Respond with the list of top-rated movies
  res.json({ movies: topRatedMovies });
};
