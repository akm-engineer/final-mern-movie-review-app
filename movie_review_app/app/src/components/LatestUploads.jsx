/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useMovies } from "../hooks";
import MovieListItem from "./MovieListItem";

// LatestUploads Component
export default function LatestUploads() {
  // Destructuring values from the custom hook 'useMovies'
  const { fetchLatestUploads, latestUploads } = useMovies();

  // Callback function for updating the UI
  const handleUIUpdate = () => fetchLatestUploads();

  // useEffect hook to fetch latest uploads on component mount
  useEffect(() => {
    fetchLatestUploads();
  }, []); // Empty dependency array to ensure the effect runs only once on mount

  // Main component structure
  return (
    <>
      <div className="bg-white shadow dark:shadow dark:bg-secondary p-5 rounded col-span-2 ">
        {/* Heading for the section */}
        <h1 className="font-semibold text-2xl mb-2 text-primary dark:text-white">
          Recent Uploads
        </h1>

        <div className="space-y-3">
          {/* Mapping over the latestUploads array and rendering MovieListItem for each movie */}
          {latestUploads.map((movie) => {
            return (
              <MovieListItem
                key={movie.id}
                movie={movie}
                afterDelete={handleUIUpdate} // Callback after movie deletion
                afterUpdate={handleUIUpdate} // Callback after movie update
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
