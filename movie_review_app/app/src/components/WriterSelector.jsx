import React, { useState } from "react";
import { searchActor } from "../api/actor";
import { useSearch } from "../hooks";
import { renderItem } from "../utils/helper";
import LiveSearch from "./LiveSearch";

// WriterSelector Component
export default function WriterSelector({ onSelect }) {
  // State for the input value
  const [value, setValue] = useState("");
  // State for the search results (actor profiles)
  const [profiles, setProfiles] = useState([]);

  // Custom hook for handling search logic
  const { handleSearch, resetSearch } = useSearch();

  // Function to handle changes in the input value
  const handleOnChange = ({ target }) => {
    const { value } = target;
    setValue(value);
    // Triggering the search with the searchActor function from the API

    handleSearch(searchActor, value, setProfiles);
  };

  // Function to handle selection of a profile from the search results
  const handleOnSelect = (profile) => {
    // Resetting the input value, triggering the onSelect callback,
    // clearing the search results, and resetting the search state
    setValue("");
    onSelect(profile);
    setProfiles([]);
    resetSearch();
  };

  // Rendering the LiveSearch component
  return (
    <LiveSearch
      name="writers"
      placeholder="Search profile"
      results={profiles}
      renderItem={renderItem}
      onSelect={handleOnSelect}
      onChange={handleOnChange}
      value={value}
    />
  );
}
