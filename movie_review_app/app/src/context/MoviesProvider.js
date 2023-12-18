import React, { useState, createContext } from "react";
import { getMovies } from "../api/movie";
import { useNotification } from "../hooks";

// Creating a context for movie-related data and functions
export const MovieContext = createContext();

// Constants for the number of movies per page and the initial page number
const limit = 10;
let currentPageNo = 0;

// MoviesProvider Component
const MoviesProvider = ({ children }) => {
  // State for the list of movies
  const [movies, setMovies] = useState([]);

  // State for the latest uploads
  const [latestUploads, setLatestUploads] = useState([]);

  // State to track whether the end of the movie list is reached
  const [reachedToEnd, setReachedToEnd] = useState(false);

  // Notification hook for updating notifications
  const { updateNotification } = useNotification();

  // Function to fetch the latest movie uploads
  const fetchLatestUploads = async (qty = 5) => {
    const { error, movies } = await getMovies(0, qty);
    if (error) return updateNotification("error", error);

    setLatestUploads([...movies]);
  };

  // Function to fetch movies based on the page number
  const fetchMovies = async (pageNo = currentPageNo) => {
    const { error, movies } = await getMovies(pageNo, limit);
    if (error) updateNotification("error", error);

    // Check if no movies are returned
    if (!movies.length) {
      currentPageNo = pageNo - 1;
      return setReachedToEnd(true);
    }

    setMovies([...movies]);
  };

  // Function to fetch the next page of movies
  const fetchNextPage = () => {
    if (reachedToEnd) return;
    currentPageNo += 1;
    fetchMovies(currentPageNo);
  };

  // Function to fetch the previous page of movies
  const fetchPrevPage = () => {
    if (currentPageNo <= 0) return;
    if (reachedToEnd) setReachedToEnd(false);

    currentPageNo -= 1;
    fetchMovies(currentPageNo);
  };

  // Providing the context values to the child components
  return (
    <MovieContext.Provider
      value={{
        movies,
        latestUploads,
        fetchLatestUploads,
        fetchMovies,
        fetchNextPage,
        fetchPrevPage,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export default MoviesProvider;
