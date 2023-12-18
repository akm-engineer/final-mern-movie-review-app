//Methods to take things fron backend API
import { catchError, getToken } from "../utils/helper";
import client from "./client";

// Uploads a trailer to the server using the provided form data.
export const uploadTrailer = async (formData, onUploadProgress) => {
  const token = getToken();
  try {
    // Make a POST request to upload a trailer
    const { data } = await client.post("/movie/upload-trailer", formData, {
      headers: {
        authorization: "Bearer " + token,
        "content-type": "multipart/form-data",
      },

      // Track upload progress if provided
      onUploadProgress: ({ loaded, total }) => {
        if (onUploadProgress)
          onUploadProgress(Math.floor((loaded / total) * 100));
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//Uploads a movie to the server using the provided form data.
export const uploadMovie = async (formData) => {
  const token = getToken();
  try {
    const { data } = await client.post("/movie/create", formData, {
      headers: {
        authorization: "Bearer " + token,
        "content-type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//Retrieves movie data for updating based on the provided movie ID.
export const getMovieForUpdate = async (id) => {
  const token = getToken();
  try {
    //// Make a GET request to retrieve movie data for update
    const { data } = await client("/movie/for-update/" + id, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//Retrieves a list of movies with pagination support for admin users.
export const getMovies = async (pageNo, limit) => {
  const token = getToken();
  try {
    // Make a GET request to retrieve a list of movies
    const { data } = await client(
      `/movie/movies?pageNo=${pageNo}&limit=${limit}`,
      {
        headers: {
          authorization: "Bearer " + token,
          "content-type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (error) {
    return catchError(error);
  }
};

// Updates an existing movie with the provided ID using the given form data.
export const updateMovie = async (id, formData) => {
  const token = getToken();
  try {
    // Make a PATCH request to update an existing movie
    const { data } = await client.patch("/movie/update/" + id, formData, {
      headers: {
        authorization: "Bearer " + token,
        "content-type": "multipart/form-data",
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//Deletes a movie with the provided ID.
export const deleteMovie = async (id) => {
  const token = getToken();
  try {
    const { data } = await client.delete(`/movie/${id}`, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//Searches for movies based on the provided title for admin users.
export const searchMovieForAdmin = async (title) => {
  const token = getToken();
  try {
    const { data } = await client(`/movie/search?title=${title}`, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

// Retrieves a list of top-rated movies based on the provided type.
export const getTopRatedMovies = async (type, signal) => {
  try {
    let endpoint = "/movie/top-rated";
    if (type) endpoint = endpoint + "?type=" + type;

    const { data } = await client(endpoint, { signal });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//Retrieves a list of the latest uploaded movies.
export const getLatestUploads = async (signal) => {
  try {
    const { data } = await client("/movie/latest-uploads", { signal });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//Retrieves details of a single movie based on the provided ID.
export const getSingleMovie = async (id) => {
  try {
    const { data } = await client("/movie/single/" + id);
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//Retrieves a list of movies related to the provided movie ID.
export const getRelatedMovies = async (id) => {
  try {
    const { data } = await client("/movie/related/" + id);
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//Searching Movies for normal users
export const searchPublicMovies = async (title) => {
  try {
    // Make a GET request to search for movies for public users
    const { data } = await client("/movie/search-public?title=" + title);
    return data;
  } catch (error) {
    return catchError(error);
  }
};
