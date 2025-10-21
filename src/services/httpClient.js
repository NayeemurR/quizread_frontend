import axios from "axios";
import { API_CONFIG } from "../config/api.js";

// Create axios instance with base configuration
const httpClient = axios.create({
  baseURL: API_CONFIG.BASE_URL || undefined, // Use undefined if BASE_URL is empty
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
httpClient.interceptors.request.use(
  (config) => {
    // Add auth token to requests
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("Making request to:", config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
httpClient.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.data);
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      window.location.href = "/auth";
    }

    return Promise.reject(error);
  }
);

export default httpClient;
