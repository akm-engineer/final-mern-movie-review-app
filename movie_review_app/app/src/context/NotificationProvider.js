import React, { createContext, useState } from "react";

// Creating a context for managing notifications
export const NotificationContext = createContext();

let timeoutId;

// NotificationProvider Component
export default function NotificationProvider({ children }) {
  // State to manage the notification message
  const [notification, setNotification] = useState("");
  // State to manage the notification styling classes
  const [classes, setClasses] = useState("");

  // Function to update the notification
  const updateNotification = (type, value) => {
    if (timeoutId) clearTimeout(timeoutId);
    //preventing LAG
    switch (type) {
      case "error":
        setClasses("bg-red-500");
        break;
      case "success":
        setClasses("bg-green-500");
        break;
      case "warning":
        setClasses("bg-orange-500");
        break;
      default:
        setClasses("bg-red-500");
    }
    setNotification(value);

    // Set a timeout to clear the notification after a certain duration
    timeoutId = setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  // Providing the context values to the child components
  return (
    <NotificationContext.Provider value={{ updateNotification }}>
      {children}
      {/* Render the notification message if it exists */}
      {notification && (
        <div className="fixed left-1/2 -translate-x-1/2 top-24 ">
          <div className="bounce-custom shadow-md shadow-gray-400 rounded">
            <p className={classes + " text-white px-4 py-2 font-semibold"}>
              {notification}
            </p>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}
