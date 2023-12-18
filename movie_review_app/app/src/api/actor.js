import { catchError, getToken } from "../utils/helper";
import client from "./client";

//Creates a new actor
export const createActor = async (formData) => {
  const token = getToken();
  try {
    // Make a POST request to create a new actor
    const { data } = await client.post("/actor/create", formData, {
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

// Updates an existing actor with the provided ID using the given form data.
export const updateActor = async (id, formData) => {
  const token = getToken();
  try {
    // Make a POST request to update an existing actor
    const { data } = await client.post("/actor/update/" + id, formData, {
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

//Deletes an actor with the provided ID.
export const deleteActor = async (id) => {
  const token = getToken();
  try {
    // Make a DELETE request to delete an actor
    const { data } = await client.delete("/actor/" + id, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//Searches for actors based on the provided query.
export const searchActor = async (query) => {
  const token = getToken();
  try {
    // Make a GET request to search for actors
    const { data } = await client(`/actor/search?name=${query}`, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

//Retrieves a list of actors with pagination support.
export const getActors = async (pageNo, limit) => {
  const token = getToken();
  try {
    // Make a GET request to retrieve a list of actors with pagination
    const { data } = await client(
      `/actor/actors?pageNo=${pageNo}&limit=${limit}`,
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

//Retrieves the profile of an actor with the provided ID.
export const getActorProfile = async (id) => {
  try {
    const { data } = await client(`/actor/single/${id}`);
    return data;
  } catch (error) {
    return catchError(error);
  }
};
