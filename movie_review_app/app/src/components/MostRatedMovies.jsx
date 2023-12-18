/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { getMostRatedMovies } from "../api/admin";
import { useNotification } from "../hooks";
import { convertReviewCount } from "../utils/helper";
import RatingStar from "./RatingStar";

// MostRatedMovies Component
export default function MostRatedMovies() {
  // MostRatedMovies Component
  const [movies, setMovies] = useState([]);
  // Notification hook for updating notifications
  const { updateNotification } = useNotification();

  // Function to fetch most rated movies from the API
  const fetchMostRatedMovies = async () => {
    // Calling the API function to get most rated movies
    const { error, movies } = await getMostRatedMovies();
    if (error) return updateNotification("error", error);

    // Updating the state with the retrieved movies
    setMovies([...movies]);
  };

  // useEffect hook to fetch most rated movies on component mount
  useEffect(() => {
    fetchMostRatedMovies();
  }, []);
  // Main component structure
  return (
    <div className="bg-white shadow dark:shadow dark:bg-secondary p-5 rounded">
      <h1 className="font-semibold text-2xl mb-2 text-primary dark:text-white">
        {/* Heading for the section */}
        Most Rated Movies
      </h1>
      <ul className="space-y-3">
        {/* Mapping over the movies array and rendering details for each movie */}
        {movies.map((movie) => {
          return (
            <li key={movie.id}>
              <h1 className="dark:text-white text-secondary font-semibold">
                {movie.title}
              </h1>
              {/* Rating and review count */}
              <div className="flex space-x-2">
                <RatingStar rating={movie.reviews?.ratingAvg} />
                <p className="text-light-subtle dark:text-dark-subtle">
                  {/* Convert and display review count */}
                  {convertReviewCount(movie.reviews?.reviewCount)} Reviews
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
