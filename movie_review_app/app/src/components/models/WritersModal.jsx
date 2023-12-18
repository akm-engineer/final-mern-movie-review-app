import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import ModalContainer from "./ModalContainer";

// WritersModal component displays a modal with a list of writer profiles
export default function WritersModal({
  profiles = [],
  visible,
  onClose,
  onRemoveClick,
}) {
  return (
    // ModalContainer is a reusable modal wrapper
    <ModalContainer ignoreContainer onClose={onClose} visible={visible}>
      {/* Container for the list of writer profiles */}

      <div className="space-y-2 dark:bg-primary bg-white rounded max-w-[45rem] max-h-[40rem] overflow-auto p-2 custom-scroll-bar">
        {/* Map through writer profiles and display information */}

        {profiles.map(({ id, name, avatar }) => {
          return (
            /* Container for each writer profile */

            <div
              key={id}
              className="flex space-x-3 dark:bg-secondary bg-white drop-shadow-md rounded"
            >
              {/* Display writer's avatar */}

              <img
                className="w-16 h-16 aspect-square rounded object-cover"
                src={avatar}
                alt={name}
              />
              {/* Display writer's name */}
              <p className="w-full font-semibold dark:text-white text-primary">
                {name}
              </p>
              {/* Button to remove the writer */}
              <button
                onClick={() => onRemoveClick(id)}
                className="dark:text-white text-primary hover:opacity-80 transition p-2"
              >
                <AiOutlineClose />
              </button>
            </div>
          );
        })}
      </div>
    </ModalContainer>
  );
}
