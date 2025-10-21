import httpClient from "./httpClient.js";
import { API_CONFIG } from "../config/api.js";

export const libraryService = {
  /**
   * Add a new book to user's library
   * @param {string} ownerId - Owner's user ID
   * @param {string} title - Book title
   * @param {number} totalPages - Total number of pages
   * @param {string} storageUrl - Google Cloud storage URL
   * @returns {Promise<{bookId: string}>}
   */
  async addBook(ownerId, title, totalPages, storageUrl) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.LIBRARY.ADD_BOOK,
      {
        ownerId,
        title,
        totalPages,
        storageUrl,
      }
    );
    return response.data;
  },

  /**
   * Check if a book exists
   * @param {string} bookId - Book ID
   * @returns {Promise<{exists: boolean}>}
   */
  async getBook(bookId) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.LIBRARY.GET_BOOK,
      {
        bookId,
      }
    );
    return response.data;
  },

  /**
   * List all books owned by a user
   * @param {string} ownerId - Owner's user ID
   * @returns {Promise<{bookIds: string[]}>}
   */
  async listBooks(ownerId) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.LIBRARY.LIST_BOOKS,
      {
        ownerId,
      }
    );
    return response.data;
  },

  /**
   * Remove a book from user's library
   * @param {string} ownerId - Owner's user ID
   * @param {string} bookId - Book ID
   * @returns {Promise<{}>}
   */
  async removeBook(ownerId, bookId) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.LIBRARY.REMOVE_BOOK,
      {
        ownerId,
        bookId,
      }
    );
    return response.data;
  },

  /**
   * Get detailed book information
   * @param {string} bookId - Book ID
   * @returns {Promise<Array>}
   */
  async getBookDetails(bookId) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.LIBRARY.GET_BOOK_DETAILS,
      {
        bookId,
      }
    );
    return response.data;
  },

  /**
   * Get all books owned by a specific user
   * @param {string} ownerId - Owner's user ID
   * @returns {Promise<Array>}
   */
  async getUserBooks(ownerId) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.LIBRARY.GET_USER_BOOKS,
      {
        ownerId,
      }
    );
    return response.data;
  },

  /**
   * Get all books in the library
   * @returns {Promise<Array>}
   */
  async getAllBooks() {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.LIBRARY.GET_ALL_BOOKS,
      {}
    );
    return response.data;
  },
};
