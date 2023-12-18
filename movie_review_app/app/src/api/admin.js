import { catchError, getToken } from "../utils/helper";
import client from "./client";

//Retrieves information about the application.
export const getAppInfo = async () => {
  try {
    const token = getToken();
    const { data } = await client("/admin/app-info", {
      headers: {
        authorization: "Bearer " + token,
      },
    });

    return data;
  } catch (error) {
    return catchError(error);
  }
};

//Retrieves a list of the most-rated movies in the application.
export const getMostRatedMovies = async () => {
  try {
    const token = getToken();
    const { data } = await client("/admin/most-rated", {
      headers: {
        authorization: "Bearer " + token,
      },
    });

    return data;
  } catch (error) {
    return catchError(error);
  }
};
