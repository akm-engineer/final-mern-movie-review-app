/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";

import { useMovies } from "../../hooks";

import MovieListItem from "../MovieListItem";
import NextAndPrevButton from "../NextAndPrevButton";

let currentPageNo = 0;

// Component for displaying movies
export default function Movies() {
  const {
    fetchMovies,
    movies: newMovies,
    fetchPrevPage,
    fetchNextPage,
  } = useMovies();

  const handleUIUpdate = () => {
    fetchMovies();
  };

  useEffect(() => {
    fetchMovies(currentPageNo);
  }, []);

  return (
    <>
      <div className="space-y-3 p-5">
        {/* Map through the fetched movies and render MovieListItem for each */}
        {newMovies.map((movie) => {
          return (
            <MovieListItem
              key={movie.id}
              movie={movie}
              afterDelete={handleUIUpdate}
              afterUpdate={handleUIUpdate}
            />
          );
        })}
        {/* Next and Previous buttons for pagination */}
        <NextAndPrevButton
          className="mt-5"
          onNextClick={fetchNextPage}
          onPrevClick={fetchPrevPage}
        />
      </div>
    </>
  );
}
