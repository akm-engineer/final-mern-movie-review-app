/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { getRelatedMovies } from "../api/movie";
import { useNotification } from "../hooks";
import MovieList from "./user/MovieList";

// RelatedMovies Component
export default function RelatedMovies({ movieId }) {
  const [movies, setMovies] = useState([]);

  const { updateNotification } = useNotification();

  // Function to fetch related movies based on the provided movieId
  const fetchRelatedMovies = async () => {
    // Calling the API function to get related movies
    const { error, movies } = await getRelatedMovies(movieId);
    if (error) return updateNotification("error", error);

    // Updating the state with the retrieved movies
    setMovies([...movies]);
  };

  // useEffect hook to fetch related movies when movieId changes
  useEffect(() => {
    if (movieId) fetchRelatedMovies();
  }, [movieId]);
  return <MovieList title="Related Movies" movies={movies} />;
}
