// Checks if the provided email is in a valid format.
export const isValidEmail = (email) => {
  const isValid = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  return isValid.test(email);
};

// Retrieves the authentication token from the local storage.
export const getToken = () => localStorage.getItem("auth-token");

// Extracts error information from an Axios error object.
export const catchError = (error) => {
  const { response } = error;
  // If there's response data, return it; otherwise, provide a generic error object.
  if (response?.data) return response.data;

  return { error: error.message || error };
};

// Renders an item with an avatar image and name.
export const renderItem = (result) => {
  return (
    <div className="flex rounded overflow-hidden">
      <img src={result.avatar} alt="" className="w-16 h-16 object-cover" />
      <p className="dark:text-white font-semibold">{result.name}</p>
    </div>
  );
};

// Retrieves the appropriate movie poster from the provided array.
export const getPoster = (posters = []) => {
  const { length } = posters;

  // If there are no posters, return null.
  if (!length) return null;

  // if poster has more then 2 items then selecting second poster.
  if (length > 2) return posters[1];

  // other wise the first one
  return posters[0];
};

// Converts a review count to a more readable format (e.g., 1.5k for 1500).
export const convertReviewCount = (count = 0) => {
  if (count <= 999) return count;

  // If the count is greater than 999, convert it to k format with two decimal places.
  return parseFloat(count / 1000).toFixed(2) + "k";
};
