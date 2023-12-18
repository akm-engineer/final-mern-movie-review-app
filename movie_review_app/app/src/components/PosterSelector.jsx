import React from "react";

// Common styles for poster UI
const commonPosterUI =
  "flex justify-center items-center border border-dashed rounded aspect-video dark:border-dark-subtle border-light-subtle cursor-pointer";

// PosterSelector Component
export default function PosterSelector({
  name,
  accept,
  lable,
  selectedPoster,
  className,
  onChange,
}) {
  return (
    <div>
      {/* File input for selecting a poster */}
      <input
        accept={accept}
        onChange={onChange}
        name={name}
        id={name}
        type="file"
        hidden
      />
      {/* Label for the file input, displaying either the selected poster or default poster UI */}
      <label htmlFor={name}>
        {selectedPoster ? (
          // Displaying the selected poster
          <img
            className={commonPosterUI + " object-cover " + className}
            src={selectedPoster}
            alt=""
          />
        ) : (
          // Displaying default poster UI
          <PosterUI className={className} label={lable} />
        )}
      </label>
    </div>
  );
}

// PosterUI Component
const PosterUI = ({ label, className }) => {
  return (
    <div className={commonPosterUI + " " + className}>
      {/* Placeholder text for selecting a poster */}
      <span className="dark:text-dark-subtle text-light-subtle">{label}</span>
    </div>
  );
};
