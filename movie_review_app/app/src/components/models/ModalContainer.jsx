import React from "react";

// ModalContainer component
export default function ModalContainer({
  visible,
  ignoreContainer,
  children,
  onClose,
}) {
  // Function to handle click events
  const handleClick = (e) => {
    if (e.target.id === "modal-container") onClose && onClose();
  };

  // Function to render children inside the container

  const renderChildren = () => {
    if (ignoreContainer) return children;

    return (
      <div className="dark:bg-primary bg-white rounded w-[45rem] h-[40rem] overflow-auto p-2 custom-scroll-bar">
        {children}
      </div>
    );
  };

  // If the modal is not visible, return null (no rendering)
  if (!visible) return null;

  // Render the modal container with backdrop
  return (
    <div
      onClick={handleClick}
      id="modal-container"
      className="fixed inset-0 dark:bg-white dark:bg-opacity-50 bg-primary bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
    >
      {renderChildren()}
    </div>
  );
}
