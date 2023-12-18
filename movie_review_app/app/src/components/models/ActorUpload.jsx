import React, { useState } from "react";
import { createActor } from "../../api/actor";
import { useNotification } from "../../hooks";
import ActorForm from "../form/ActorForm";
import ModalContainer from "./ModalContainer";

// ActorUpload component for creating a new actor
export default function ActorUpload({ visible, onClose }) {
  const [busy, setBusy] = useState(false);

  const { updateNotification } = useNotification();

  // Handle form submission
  const handleSubmit = async (data) => {
    setBusy(true);
    const { error } = await createActor(data);
    setBusy(false);
    if (error) return updateNotification("error", error);

    updateNotification("success", "Actor created successfully.");
    onClose();
  };

  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      {/* Render the ActorForm component with necessary props */}
      <ActorForm
        onSubmit={!busy ? handleSubmit : null}
        title="Create New Actor"
        btnTitle="Create" // Button title for the ActorForm
        busy={busy} // Pass the busy state to the ActorForm
      />
    </ModalContainer>
  );
}
