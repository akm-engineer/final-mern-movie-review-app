import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Actors from "../components/admin/Actors";
import Dashboard from "../components/admin/Dashboard";
import Header from "../components/admin/Header";
import Movies from "../components/admin/Movies";
import MovieUpload from "../components/admin/MovieUpload";
import Navbar from "../components/admin/Navbar";
import ActorUpload from "../components/models/ActorUpload";
import NotFound from "../components/NotFound";
import SearchMovies from "../components/admin/SearchMovies";

export default function AdminNavigator() {
  // State for controlling the visibility of the movie upload modal
  const [showMovieUploadModal, setShowMovieUploadModal] = useState(false);

  // State for controlling the visibility of the actor upload modal
  const [showActorUploadModal, setShowActorUploadModal] = useState(false);

  // Function to display the movie upload modal
  const displayMovieUploadModal = () => {
    setShowMovieUploadModal(true);
  };

  // Function to hide the movie upload modal
  const hideMovieUploadModal = () => {
    setShowMovieUploadModal(false);
  };

  // Function to display the actor upload modal
  const displayActorUploadModal = () => {
    setShowActorUploadModal(true);
  };

  // Function to hide the actor upload modal
  const hideActorUploadModal = () => {
    setShowActorUploadModal(false);
  };

  return (
    <>
      <div className="flex dark:bg-primary bg-white">
        {/* Admin Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <div className="flex-1 max-w-screen-xl">
          {/* Header with buttons for adding movies and actors */}
          <Header
            onAddMovieClick={displayMovieUploadModal}
            onAddActorClick={displayActorUploadModal}
          />

          {/* Routing for different admin pages */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/actors" element={<Actors />} />
            <Route path="/search" element={<SearchMovies />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>

      {/* Movie Upload Modal */}
      <MovieUpload
        visible={showMovieUploadModal}
        onClose={hideMovieUploadModal}
      />

      {/* Actor Upload Modal */}
      <ActorUpload
        visible={showActorUploadModal}
        onClose={hideActorUploadModal}
      />
    </>
  );
}
