/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

import { getTopRatedMovies } from "../../api/movie";
import { useNotification } from "../../hooks";

import MovieList from "./MovieList";

// component for displaying top-rated documentary movies
export default function TopRatedMovies() {
  const [movies, setMovies] = useState([]);
  const { updateNotification } = useNotification();

  // Function to fetch top-rated documentary movies
  const fetchMovies = async (signal) => {
    const { error, movies } = await getTopRatedMovies(null, signal);
    if (error) return updateNotification("error", error);

    setMovies([...movies]);
  };

  useEffect(() => {
    // Create an AbortController to handle the cleanup when the component unmounts
    const ac = new AbortController();

    fetchMovies(ac.signal);
    // Cleanup function to abort the fetch operation when the component unmounts
    return () => {
      ac.abort();
    };
  }, []);

  return <MovieList movies={movies} title="Viewers choice (Movies)" />;
}
