import React, { createContext, useState } from "react";
import { useNotification } from "../hooks";

// Creating a context for managing search-related data and functions
export const SearchContext = createContext();

let timeoutId;

// Debounce function to delay the execution of the search function
const debounce = (func, delay) => {
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};
// SearchProvider Component
export default function SearchProvider({ children }) {
  // State to track whether a search is in progress
  const [searching, setSearching] = useState(false);
  // State to store the search results
  const [results, setResults] = useState([]);
  // State to track whether no results were found
  const [resultNotFound, setResultNotFound] = useState(false);

  const { updateNotification } = useNotification();
  // Function to perform a search with debouncing
  const search = async (method, query, updaterFun) => {
    const { error, results } = await method(query);
    if (error) return updateNotification("error", error);

    // Check if no results were found
    if (!results.length) {
      setResults([]);
      updaterFun && updaterFun([]);
      return setResultNotFound(true);
    }

    setResultNotFound(false);
    setResults(results);
    updaterFun && updaterFun([...results]);
  };
  // Debounced version of the search function
  const debounceFunc = debounce(search, 300);

  // Function to handle search input
  const handleSearch = (method, query, updaterFun) => {
    setSearching(true);

    // If the query is empty, reset the search
    if (!query.trim()) {
      updaterFun && updaterFun([]);
      return resetSearch();
    }

    // Perform a debounced search
    debounceFunc(method, query, updaterFun);
  };

  // Function to reset the search state
  const resetSearch = () => {
    setSearching(false);
    setResults([]);
    setResultNotFound(false);
  };

  // Providing the context values to the child components

  return (
    <SearchContext.Provider
      value={{ handleSearch, resetSearch, searching, resultNotFound, results }}
    >
      {children}
    </SearchContext.Provider>
  );
}
