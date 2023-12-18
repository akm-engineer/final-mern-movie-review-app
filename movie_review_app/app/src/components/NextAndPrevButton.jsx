import React from "react";

// NextAndPrevButton Component
export default function NextAndPrevButton({
  className = "",
  onNextClick,
  onPrevClick,
}) {
  // Function to get the CSS classes for the component
  const getClasses = () => {
    return "flex justify-end items-center space-x-3 ";
  };

  // Main component structure
  return (
    <div className={getClasses() + className}>
      {/* Button for Previous action */}
      <Button onClick={onPrevClick} title="Prev" />
      {/* Button for Next action */}
      <Button onClick={onNextClick} title="Next" />
    </div>
  );
}

// Button Component
const Button = ({ title, onClick }) => {
  // Render a button with specified title and click handler
  return (
    <button
      type="button"
      className="text-primary dark:text-white hover:underline"
      onClick={onClick}
    >
      {title}
    </button>
  );
};
