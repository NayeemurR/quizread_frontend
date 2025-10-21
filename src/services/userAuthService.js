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
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.USER_AUTH.REGISTER,
      {
        email,
        passwordHash,
      }
    );
    return response.data;
  },

  /**
   * Login a user
   * @param {string} email - User's email
   * @param {string} passwordHash - Hashed password
   * @returns {Promise<{userId: string}>}
   */
  async login(email, passwordHash) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.USER_AUTH.LOGIN,
      {
        email,
        passwordHash,
      }
    );
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
