import React, { useState } from "react";
import { searchActor } from "../api/actor";
import { useSearch } from "../hooks";
import { renderItem } from "../utils/helper";
import Label from "./Label.jsx";
import LiveSearch from "./LiveSearch";

// DirectorSelector component takes onSelect as a prop
export default function DirectorSelector({ onSelect }) {
  // State to manage the input value and search results
  const [value, setValue] = useState("");
  const [profiles, setProfiles] = useState([]);

  // Custom hook for handling search functionality
  const { handleSearch, resetSearch } = useSearch();

  // Handler for input change
  const handleOnChange = ({ target }) => {
    const { value } = target;
    setValue(value);
    // Perform search using the handleSearch hook
    handleSearch(searchActor, value, setProfiles);
  };

  // Handler for selecting a profile from the search results
  const handleOnSelect = (profile) => {
    setValue(profile.name);
    onSelect(profile); // Call the onSelect prop with the selected profile
    setProfiles([]); // Clear the search results
    resetSearch(); // Reset the search state
  };

  // Render the component
  return (
    <div>
      {/* Label for the input */}
      <Label htmlFor="director">Director</Label>
      {/* LiveSearch component for live search functionality */}
      <LiveSearch
        name="director"
        value={value}
        placeholder="Search profile"
        results={profiles}
        renderItem={renderItem} // Render each item in the search results
        onSelect={handleOnSelect} // Handle selection of a search result
        onChange={handleOnChange} // Handle input change
      />
    </div>
  );
}
