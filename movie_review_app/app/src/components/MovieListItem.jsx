import React, { useState } from "react";
import { BsTrash, BsPencilSquare, BsBoxArrowUpRight } from "react-icons/bs";
import { deleteMovie } from "../api/movie";
import { useNotification } from "../hooks";
import { getPoster } from "../utils/helper";
import ConfirmModal from "./models/ConfirmModal";
import UpdateMovie from "./models/UpdateMovie";

// MovieListItem Component
const MovieListItem = ({ movie, afterDelete, afterUpdate }) => {
  // State variables
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const { updateNotification } = useNotification();

  // Function to handle movie deletion confirmation
  const handleOnDeleteConfirm = async () => {
    setBusy(true);
    const { error, message } = await deleteMovie(movie.id);
    setBusy(false);

    if (error) return updateNotification("error", error);

    hideConfirmModal();
    updateNotification("success", message);
    afterDelete(movie);
  };

  // Function to handle edit click and show update modal
  const handleOnEditClick = () => {
    setShowUpdateModal(true);
    setSelectedMovieId(movie.id);
  };
  // Function to handle movie update
  const handleOnUpdate = (movie) => {
    afterUpdate(movie);
    setShowUpdateModal(false);
    setSelectedMovieId(null);
  };

  // Functions to display and hide the confirm modal
  const displayConfirmModal = () => setShowConfirmModal(true);
  const hideConfirmModal = () => setShowConfirmModal(false);

  // Render MovieCard component and modals
  return (
    <>
      <MovieCard
        movie={movie}
        onDeleteClick={displayConfirmModal}
        onEditClick={handleOnEditClick}
      />
      <div className="p-0">
        <ConfirmModal
          visible={showConfirmModal}
          onConfirm={handleOnDeleteConfirm}
          onCancel={hideConfirmModal}
          title="Are you sure?"
          subtitle="This action will remove this movie permanently!"
          busy={busy}
        />
        <UpdateMovie
          movieId={selectedMovieId}
          visible={showUpdateModal}
          onSuccess={handleOnUpdate}
        />
      </div>
    </>
  );
};

// MovieCard Component
const MovieCard = ({ movie, onDeleteClick, onEditClick, onOpenClick }) => {
  // Extracting movie details
  const { poster, title, responsivePosters, genres = [], status } = movie;
  // Render the MovieCard table with details and action buttons
  return (
    <table className="w-full border-b">
      <tbody>
        <tr>
          <td>
            {/* Movie poster */}
            <div className="w-24">
              <img
                className="w-full aspect-video"
                src={getPoster(responsivePosters) || poster}
                alt={title}
              />
            </div>
          </td>

          <td className="w-full pl-5">
            {/* Movie title and genres */}
            <div>
              <h1 className="text-lg font-semibold text-primary dark:text-white">
                {title}
              </h1>
              <div className="space-x-1">
                {/* Display genres */}
                {genres.map((g, index) => {
                  return (
                    <span
                      key={g + index}
                      className=" text-primary dark:text-white text-xs"
                    >
                      {g}
                    </span>
                  );
                })}
              </div>
            </div>
          </td>

          <td className="px-5">
            {/* Movie status */}
            <p className="text-primary dark:text-white">{status}</p>
          </td>

          <td>
            {/* Action buttons */}
            <div className="flex items-center space-x-3 text-primary dark:text-white text-lg">
              <button onClick={onDeleteClick} type="button">
                <BsTrash />
              </button>
              <button onClick={onEditClick} type="button">
                <BsPencilSquare />
              </button>
              <button onClick={onOpenClick} type="button">
                <BsBoxArrowUpRight />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default MovieListItem;
