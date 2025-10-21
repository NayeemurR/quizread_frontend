import httpClient from "./httpClient.js";
import { API_CONFIG } from "../config/api.js";

export const userAuthService = {
  /**
   * Register a new user
   * @param {string} email - User's email
   * @param {string} passwordHash - Hashed password
   * @returns {Promise<{userId: string}>}
   */
  async register(email, passwordHash) {
    console.log("Attempting registration for email:", email);
    console.log("Register endpoint:", API_CONFIG.ENDPOINTS.USER_AUTH.REGISTER);

    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.USER_AUTH.REGISTER,
      {
        email,
        passwordHash,
      }
    );

    console.log("Registration response:", response.data);
    return response.data;
  },

  /**
   * Login a user
   * @param {string} email - User's email
   * @param {string} passwordHash - Hashed password
   * @returns {Promise<{userId: string}>}
   */
  async login(email, passwordHash) {
    console.log("Attempting login for email:", email);
    console.log("Login endpoint:", API_CONFIG.ENDPOINTS.USER_AUTH.LOGIN);

    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.USER_AUTH.LOGIN,
      {
        email,
        passwordHash,
      }
    );

    console.log("Login response:", response.data);
    return response.data;
  },

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Array>}
   */
  async getUser(userId) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.USER_AUTH.GET_USER,
      {
        userId,
      }
    );
    return response.data;
  },

  /**
   * Get user by email
   * @param {string} email - User's email
   * @returns {Promise<Array>}
   */
  async getUserByEmail(email) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.USER_AUTH.GET_USER_BY_EMAIL,
      {
        email,
      }
    );
    return response.data;
  },

  /**
   * Get all users
   * @returns {Promise<Array>}
   */
  async getAllUsers() {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.USER_AUTH.GET_ALL_USERS,
      {}
    );
    return response.data;
  },
};
