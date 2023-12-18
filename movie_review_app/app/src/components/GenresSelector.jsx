import React from "react";
import { ImTree } from "react-icons/im";

// GenresSelector Component
export default function GenresSelector({ badge, onClick }) {
  // Function to render the badge based on the 'badge' prop
  const renderBadge = () => {
    // If 'badge' prop is not provided, return null (no badge)
    if (!badge) return null;

    // Render a span element for the badge with specific styles
    return (
      <span className="dark:bg-dark-subtle bg-light-subtle text-white absolute top-0 right-0 translate-x-2 -translate-y-1 text-xs w-5 h-5 rounded-full flex justify-center items-center">
        {/* Display the badge value, show '9+' if it's greater than 9 */}
        {badge <= 9 ? badge : "9+"}
      </span>
    );
  };

  // Main component structure
  return (
    // Button element with onClick event handler
    <button
      type="button"
      onClick={onClick}
      className="relative flex items-center space-x-2 py-1 px-3 border-2 dark:border-dark-subtle border-light-subtle dark:hover:border-white hover:border-primary transition dark:text-dark-subtle text-light-subtle dark:hover:text-white hover:text-primary rounded"
    >
      {/* Icon for the button - ImTree from react-icons */}
      <ImTree />

      {/* Text next to the icon */}
      <span>Select Genres</span>

      {/* Render the badge using the renderBadge function */}
      {renderBadge()}
    </button>
  );
}
