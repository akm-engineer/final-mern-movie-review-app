// Importing the Axios library for making HTTP requests
import axios from "axios";

// Creating an Axios client instance with a base URL for the API
const client = axios.create({ baseURL: "http://localhost:8000/api" });

export default client;
