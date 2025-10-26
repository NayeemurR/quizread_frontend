import httpClient from "./httpClient.js";
import { API_CONFIG } from "../config/api.js";

export const libraryService = {
  /**
   * Prepare file upload to Google Cloud Storage
   * @param {string} ownerId - Owner's user ID
   * @param {string} fileName - Name of the file
   * @param {string} contentType - MIME type of the file
   * @returns {Promise<{signedUrl: string, publicUrl: string, fileName: string}>}
   */
  async prepareUpload(ownerId, fileName, contentType) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.LIBRARY.PREPARE_UPLOAD,
      {
        ownerId,
        fileName,
        contentType,
      }
    );
    console.log("Prepare upload response:", response.data);
    return response.data;
  },

  /**
   * Upload file directly to Google Cloud Storage
   * @param {string} signedUrl - Signed URL from prepareUpload
   * @param {File} file - File to upload
   * @param {string} contentType - MIME type of the file
   * @returns {Promise<Response>}
   */
  async uploadToGCS(signedUrl, file, contentType) {
    console.log("Uploading to GCS:", {
      signedUrl,
      fileName: file.name,
      contentType,
    });

    try {
      const response = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": contentType,
        },
      });

      console.log("GCS upload response:", response.status, response.statusText);

      if (!response.ok) {
        throw new Error(
          `GCS upload failed: ${response.status} ${response.statusText}`
        );
      }

      return response;
    } catch (error) {
      console.error("GCS Upload Error:", error);
      throw new Error(
        `Failed to upload to Google Cloud Storage: ${error.message}`
      );
    }
  },

  /**
   * Complete book upload workflow: prepare upload, upload to GCS, then add book
   * @param {string} ownerId - Owner's user ID
   * @param {string} title - Book title
   * @param {File} file - Book file
   * @param {number} totalPages - Total number of pages in the book
   * @returns {Promise<{bookId: string}>}
   */
  async uploadBook(ownerId, title, file, totalPages) {
    try {
      console.log("Starting upload workflow for:", {
        ownerId,
        title,
        fileName: file.name,
        totalPages,
      });

      // Step 1: Prepare upload
      const { signedUrl, publicUrl, fileName } = await this.prepareUpload(
        ownerId,
        file.name,
        file.type
      );

      console.log("Got signed URL, uploading to GCS...");

      // Step 2: Upload file to GCS
      await this.uploadToGCS(signedUrl, file, file.type);

      console.log("GCS upload successful, adding book to library...");

      // Step 3: Add book to library with the public URL and page count
      const result = await this.addBook(ownerId, title, publicUrl, totalPages);

      console.log("Book added successfully:", result);
      return result;
    } catch (error) {
      console.error("Upload workflow failed:", error);
      throw error;
    }
  },

  /**
   * Add a new book to user's library
   * @param {string} ownerId - Owner's user ID
   * @param {string} title - Book title
   * @param {string} storageUrl - Google Cloud storage URL
   * @param {number} totalPages - Total number of pages in the book
   * @returns {Promise<{bookId: string}>}
   */
  async addBook(ownerId, title, storageUrl, totalPages) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.LIBRARY.ADD_BOOK,
      {
        ownerId,
        title,
        storageUrl,
        totalPages,
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
