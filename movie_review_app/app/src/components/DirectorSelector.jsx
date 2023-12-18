import React, { useState } from "react";
import { searchActor } from "../api/actor";
import { useSearch } from "../hooks";
import { renderItem } from "../utils/helper";
import Label from "./Label.jsx";
import LiveSearch from "./LiveSearch";

export default function DirectorSelector({ onSelect }) {
  // State to manage the input value and search results
  const [value, setValue] = useState("");
  const [profiles, setProfiles] = useState([]);

  const { handleSearch, resetSearch } = useSearch();

  const handleOnChange = ({ target }) => {
    const { value } = target;
    setValue(value);
    handleSearch(searchActor, value, setProfiles);
  };

  // Handler for selecting a profile from the search results
  const handleOnSelect = (profile) => {
    setValue(profile.name);
    onSelect(profile);
    setProfiles([]);
    resetSearch();
  };

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
