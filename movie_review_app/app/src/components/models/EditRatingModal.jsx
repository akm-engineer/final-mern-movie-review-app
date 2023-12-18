import React, { useState } from "react";

import { updateReview } from "../../api/review";
import { useNotification } from "../../hooks";
import RatingForm from "../form/RatingForm";
import ModalContainer from "./ModalContainer";

export default function EditRatingModal({
  visible,
  initialState,
  onSuccess,
  onClose,
}) {
  const [busy, setBusy] = useState(false);
  const { updateNotification } = useNotification();

  // Function to handle the submission of the updated rating
  const handleSubmit = async (data) => {
    setBusy(true);
    const { error, message } = await updateReview(initialState.id, data);
    setBusy(false);

    // If there is an error, show an error notification
    if (error) return updateNotification("error", error);

    onSuccess({ ...data });
    updateNotification("success", message);
    onClose();
  };

  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      {/* Render the RatingForm component inside the ModalContainer */}

      <RatingForm
        busy={busy}
        initialState={initialState}
        onSubmit={handleSubmit}
      />
    </ModalContainer>
  );
}
