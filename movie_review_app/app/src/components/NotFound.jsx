import "../App.css";
import React from "react";
import { Link } from "react-router-dom";

// NotFound Component
const NotFound = () => {
  const placeholderImageURL =
    "https://www.vizion.com/wp-content/uploads/2018/09/shutterstock_479042983.jpg";

  return (
    <div className="notcontainer">
      <img
        src={placeholderImageURL}
        alt="Not Found"
        className="notfound"
        loading="lazy"
      />

      <div className="backbtn">
        <Link to="/" className="btn">
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
