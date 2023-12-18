const {
  sendError,
  formatActor,
  averageRatingPipeline,
  relatedMovieAggregation,
  getAverageRatings,
  topRatedMoviesPipeline,
} = require("../utils/helper");
const cloudinary = require("../cloud");
const Movie = require("../models/movie");
const Review = require("../models/review");
const mongoose = require("mongoose");
const { isValidObjectId } = mongoose;

// Controller to upload a trailer for a movie
exports.uploadTrailer = async (req, res) => {
  const { file } = req;
  if (!file) return sendError(res, "Video file is missing!");

  // Upload the trailer to Cloudinary
  const { secure_url: url, public_id } = await cloudinary.uploader.upload(
    file.path,
    {
      resource_type: "video",
    }
  );
  res.status(201).json({ url, public_id });
};

// Controller to create a new movie
exports.createMovie = async (req, res) => {
  const { file, body } = req;

  // Extracting information from the request body
  const {
    title,
    storyLine,
    director,
    releseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,
    language,
  } = body;

  // Creating a new movie instance
  const newMovie = new Movie({
    title,
    storyLine,
    releseDate,
    status,
    type,
    genres,
    tags,
    cast,
    trailer,
    language,
  });

  // Validating and setting the director and writers
  if (director) {
    if (!isValidObjectId(director))
      return sendError(res, "Invalid director id!");
    newMovie.director = director;
  }

  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId))
        return sendError(res, "Invalid writer id!");
    }
    newMovie.writers = writers;
  }

  // Uploading the movie poster to Cloudinary
  if (file) {
    // Transformation settings for the poster
    const {
      secure_url: url,
      public_id,
      responsive_breakpoints,
    } = await cloudinary.uploader.upload(file.path, {
      transformation: {
        width: 1280,
        height: 720,
      },
      responsive_breakpoints: {
        create_derived: true,
        max_width: 640,
        max_images: 3,
      },
    });

    // Constructing the final poster object

    const finalPoster = { url, public_id, responsive: [] };

    // Extracting responsive poster URLs from Cloudinary response
    const { breakpoints } = responsive_breakpoints[0];
    if (breakpoints.length) {
      for (let imgObj of breakpoints) {
        const { secure_url } = imgObj;
        finalPoster.responsive.push(secure_url);
      }
    }
    newMovie.poster = finalPoster;
  }

  // Saving the new movie to the database
  await newMovie.save();

  // Responding with the created movie information
  res.status(201).json({
    movie: {
      id: newMovie._id,
      title,
    },
  });
};

// Controller to update a movie without changing its poster
exports.updateMovieWithoutPoster = async (req, res) => {
  const { movieId } = req.params;

  // Validate the movie ID
  if (!isValidObjectId(movieId)) return sendError(res, "Invalid Movie ID!");

  // Find the movie by ID
  const movie = await Movie.findById(movieId);
  if (!movie) return sendError(res, "Movie Not Found!", 404);

  // Extracting updated movie information from the request body
  const {
    title,
    storyLine,
    director,
    releseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,
    language,
  } = req.body;

  // Updating the movie details
  movie.title = title;
  movie.storyLine = storyLine;
  movie.tags = tags;
  movie.releseDate = releseDate;
  movie.status = status;
  movie.type = type;
  movie.genres = genres;
  movie.cast = cast;
  movie.trailer = trailer;
  movie.language = language;

  // Validating and updating the director
  if (director) {
    if (!isValidObjectId(director))
      return sendError(res, "Invalid director id!");
    movie.director = director;
  }

  // Validating and updating the writers
  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId))
        return sendError(res, "Invalid writer id!");
    }

    movie.writers = writers;
  }

  // Save the updated movie
  await movie.save();

  // Respond with the updated movie information
  res.json({ message: "Movie is updated", movie });
};

// Controller to update a movie along with its poster
exports.updateMovie = async (req, res) => {
  const { movieId } = req.params;
  const { file } = req;

  // Validate the movie ID
  if (!isValidObjectId(movieId)) return sendError(res, "Invalid Movie ID!");

  // if (!req.file) return sendError(res, "Movie poster is missing!");
  // Find the movie by ID
  const movie = await Movie.findById(movieId);
  if (!movie) return sendError(res, "Movie Not Found!", 404);

  // Extracting updated movie information from the request body
  const {
    title,
    storyLine,
    director,
    releseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,
    language,
  } = req.body;

  // Updating the movie details
  movie.title = title;
  movie.storyLine = storyLine;
  movie.tags = tags;
  movie.releseDate = releseDate;
  movie.status = status;
  movie.type = type;
  movie.genres = genres;
  movie.cast = cast;
  movie.language = language;

  // Validating and updating the director
  if (director) {
    if (!isValidObjectId(director))
      return sendError(res, "Invalid director id!");
    movie.director = director;
  }

  // Validating and updating the writers
  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId))
        return sendError(res, "Invalid writer id!");
    }

    movie.writers = writers;
  }

  // update poster
  if (file) {
    // removing poster from cloud if there is any.
    const posterID = movie.poster?.public_id;
    if (posterID) {
      const { result } = await cloudinary.uploader.destroy(posterID);
      if (result !== "ok") {
        return sendError(res, "Could not update poster at the moment!");
      }

      // Upload the new poster to Cloudinary
      const {
        secure_url: url,
        public_id,
        responsive_breakpoints,
      } = await cloudinary.uploader.upload(req.file.path, {
        transformation: {
          width: 1280,
          height: 720,
        },
        responsive_breakpoints: {
          create_derived: true,
          max_width: 640,
          max_images: 3,
        },
      });

      // Construct the final poster object
      const finalPoster = { url, public_id, responsive: [] };

      // Extract responsive poster URLs from Cloudinary response
      const { breakpoints } = responsive_breakpoints[0];
      if (breakpoints.length) {
        for (let imgObj of breakpoints) {
          const { secure_url } = imgObj;
          finalPoster.responsive.push(secure_url);
        }
      }

      movie.poster = finalPoster;
    }
  }

  await movie.save();

  // Respond with the updated movie information
  res.json({
    message: "Movie is updated",
    movie: {
      id: movie._id,
      title: movie.title,
      poster: movie.poster?.url,
      genres: movie.genres,
      status: movie.status,
    },
  });
};

// Controller to remove a movie
exports.removeMovie = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) return sendError(res, "Invalid Movie ID!");

  const movie = await Movie.findById(movieId);
  if (!movie) return sendError(res, "Movie Not Found!", 404);

  // check if there is poster or not.
  // if yes then we need to remove that.

  const posterId = movie.poster?.public_id;
  if (posterId) {
    const { result } = await cloudinary.uploader.destroy(posterId);
    if (result !== "ok")
      return sendError(res, "Could not remove poster from cloud!");
  }

  // removing trailer
  const trailerId = movie.trailer?.public_id;
  if (!trailerId) return sendError(res, "Could not find trailer in the cloud!");
  const { result } = await cloudinary.uploader.destroy(trailerId, {
    resource_type: "video",
  });
  if (result !== "ok")
    return sendError(res, "Could not remove trailer from cloud!");

  await Movie.findByIdAndDelete(movieId);

  res.json({ message: "Movie removed successfully." });
};

// Controller to get a list of movies
exports.getMovies = async (req, res) => {
  const { pageNo = 0, limit = 10 } = req.query;

  // Query movies from the database
  const movies = await Movie.find({})
    .sort({ createdAt: -1 })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit));

  // Format the movie data for response
  const results = movies.map((movie) => ({
    id: movie._id,
    title: movie.title,
    poster: movie.poster?.url,
    responsivePosters: movie.poster?.responsive,
    genres: movie.genres,
    status: movie.status,
  }));

  // Respond with the list of movies
  res.json({ movies: results });
};

// Controller to get movie details for update
exports.getMovieForUpdate = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) return sendError(res, "Id is invalid");

  // Find the movie by ID and populate related data
  const movie = await Movie.findById(movieId).populate(
    "director writers cast.actor"
  );

  // Respond with formatted movie data for update
  res.json({
    movie: {
      id: movie._id,
      title: movie.title,

      storyLine: movie.storyLine,
      poster: movie.poster?.url,
      type: movie.type,
      releseDate: movie.releseDate,
      status: movie.status,
      language: movie.language,
      genres: movie.genres,
      tags: movie.tags,
      director: formatActor(movie.director),
      writers: movie.writers.map((w) => formatActor(w)),
      cast: movie.cast.map((c) => {
        return {
          id: c.id,
          profile: formatActor(c.actor),
          roleAs: c.roleAs,
          leadActor: c.leadActor,
        };
      }),
    },
  });
};

// Controller to search for movies
exports.searchMovies = async (req, res) => {
  const { title } = req.query;
  if (!title.trim()) return sendError(res, "Invalid request!!");
  const movies = await Movie.find({ title: { $regex: title, $options: "i" } });
  res.json({
    results: movies.map((m) => {
      return {
        id: m._id,
        title: m.title,
        poster: m.poster?.url,
        genres: m.genres,
        status: m.status,
      };
    }),
  });
};

// Controller to get latest movie uploads
exports.getLatestUploads = async (req, res) => {
  const { limit = 5 } = req.query;

  // Query latest public movies from the database
  const results = await Movie.find({ status: "public" })
    .sort("-createdAt")
    .limit(parseInt(limit));

  // Format the movie data for response
  const movies = results.map((m) => {
    return {
      id: m._id,
      title: m.title,
      storyLine: m.storyLine,
      poster: m.poster?.url,
      responsivePosters: m.poster.responsive,
      trailer: m.trailer?.url,
    };
  });
  res.json({ movies });
};

// Controller to get details of a single movie
exports.getSingleMovie = async (req, res) => {
  const { movieId } = req.params;

  // mongoose.Types.ObjectId(movieId)
  // Validate the movie ID
  if (!isValidObjectId(movieId))
    return sendError(res, "Movie id is not valid!");

  const movie = await Movie.findById(movieId).populate(
    "director writers cast.actor"
  );

  // Aggregate and calculate average ratings for the movie
  const [aggregatedResponse] = await Review.aggregate(
    averageRatingPipeline(movie._id)
  );

  const reviews = {};

  if (aggregatedResponse) {
    const { ratingAvg, reviewCount } = aggregatedResponse;
    reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
    reviews.reviewCount = reviewCount;
  }

  // Respond with the formatted movie data
  const {
    _id: id,
    title,
    storyLine,
    cast,
    writers,
    director,
    releseDate,
    genres,
    tags,
    language,
    poster,
    trailer,
    type,
  } = movie;

  res.json({
    movie: {
      id,
      title,
      storyLine,
      releseDate,
      genres,
      tags,
      language,
      type,
      poster: poster?.url,
      trailer: trailer?.url,
      cast: cast.map((c) => ({
        id: c._id,
        profile: {
          id: c.actor._id,
          name: c.actor.name,
          avatar: c.actor?.avatar?.url,
        },
        leadActor: c.leadActor,
        roleAs: c.roleAs,
      })),
      writers: writers.map((w) => ({
        id: w._id,
        name: w.name,
      })),
      director: {
        id: director._id,
        name: director.name,
      },
      reviews: { ...reviews },
    },
  });
};

// Controller to get related movies for a given movie
exports.getRelatedMovies = async (req, res) => {
  const { movieId } = req.params;
  if (!isValidObjectId(movieId)) return sendError(res, "Invalid movie id!");

  const movie = await Movie.findById(movieId);

  // Aggregate related movies based on movie tags
  const movies = await Movie.aggregate(
    relatedMovieAggregation(movie.tags, movie._id)
  );

  // Map movies and retrieve average ratings
  const mapMovies = async (m) => {
    const reviews = await getAverageRatings(m._id);

    return {
      id: m._id,
      title: m.title,
      poster: m.poster,
      responsivePosters: m.responsivePosters,
      reviews: { ...reviews },
    };
  };
  const relatedMovies = await Promise.all(movies.map(mapMovies));

  res.json({ movies: relatedMovies });
};

// Controller to get top-rated movies
exports.getTopRatedMovies = async (req, res) => {
  const { type = "Film" } = req.query;

  // Aggregate top-rated movies based on the provided type
  const movies = await Movie.aggregate(topRatedMoviesPipeline(type));

  const mapMovies = async (m) => {
    const reviews = await getAverageRatings(m._id);

    return {
      id: m._id,
      title: m.title,
      poster: m.poster,
      responsivePosters: m.responsivePosters,
      reviews: { ...reviews },
    };
  };

  // Get top-rated movies data
  const topRatedMovies = await Promise.all(movies.map(mapMovies));

  // Respond with the top-rated movies data
  res.json({ movies: topRatedMovies });
};

// Controller to search for public movies
exports.searchPublicMovies = async (req, res) => {
  const { title } = req.query;

  // Validate the search query
  if (!title.trim()) return sendError(res, "Invalid request!");

  // Query public movies from the database
  const movies = await Movie.find({
    title: { $regex: title, $options: "i" },
    status: "public",
  });

  // Map movies and retrieve average ratings
  const mapMovies = async (m) => {
    const reviews = await getAverageRatings(m._id);

    return {
      id: m._id,
      title: m.title,
      poster: m.poster?.url,
      responsivePosters: m.poster?.responsive,
      reviews: { ...reviews },
    };
  };

  // Get search results data
  const results = await Promise.all(movies.map(mapMovies));

  res.json({
    results,
  });
};
