import Label from "./Label";

// LabelWithBadge Component
const LabelWithBadge = ({ children, htmlFor, badge = 0 }) => {
  // Function to render the badge based on the 'badge' prop
  const renderBadge = () => {
    // If 'badge' prop is not provided or is 0, return null (no badge)
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
    // Container with relative positioning for the Label and the badge
    <div className="relative">
      {/* Render the Label component with the specified 'htmlFor' prop */}
      <Label htmlFor={htmlFor}>{children}</Label>
      {/* Render the badge using the renderBadge function */}
      {renderBadge()}
    </div>
  );
};

export default LabelWithBadge;
