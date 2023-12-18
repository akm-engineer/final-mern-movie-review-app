import React from "react";
import { useParams } from "react-router-dom";
import { addReview } from "../../api/review";
import { useNotification } from "../../hooks";
import RatingForm from "../form/RatingForm";
import ModalContainer from "./ModalContainer";

// AddRatingModal component for adding a movie rating
export default function AddRatingModal({ visible, onSuccess, onClose }) {
  const { movieId } = useParams();
  const { updateNotification } = useNotification();

  // Handle form submission for adding a movie rating
  const handleSubmit = async (data) => {
    const { error, message, reviews } = await addReview(movieId, data);
    if (error) return updateNotification("error", error);

    updateNotification("success", message);
    onSuccess(reviews); // Call the onSuccess callback with the updated reviews
    onClose();
  };
  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      {/* Render the RatingForm component with the handleSubmit callback */}
      <RatingForm onSubmit={handleSubmit} />
    </ModalContainer>
  );
}
