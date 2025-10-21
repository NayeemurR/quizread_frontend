import httpClient from "./httpClient.js";
import { API_CONFIG } from "../config/api.js";

export const checkpointQuizService = {
  /**
   * Create a new quiz from content
   * @param {string} content - Content to generate quiz from
   * @returns {Promise<{quizId: string}>}
   */
  async createQuiz(content) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.CHECKPOINT_QUIZ.CREATE_QUIZ,
      {
        content,
      }
    );
    return response.data;
  },

  /**
   * Get quiz context from PDF pages
   * @param {string} userId - User ID
   * @param {string} bookId - Book ID
   * @param {number} currentPage - Current page number
   * @param {number} pageRange - Number of pages to extract (default: 2)
   * @returns {Promise<{content: string} | {error: string}>}
   */
  async getQuizContext(userId, bookId, currentPage, pageRange = 2) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.CHECKPOINT_QUIZ.GET_QUIZ_CONTEXT,
      {
        userId,
        bookId,
        currentPage,
        pageRange,
      }
    );
    return response.data;
  },

  /**
   * Create a quiz directly from PDF content
   * @param {string} userId - User ID
   * @param {string} bookId - Book ID
   * @param {number} currentPage - Current page number
   * @param {number} pageRange - Number of pages to extract (default: 2)
   * @returns {Promise<{quizId: string} | {error: string}>}
   */
  async createQuizFromPDF(userId, bookId, currentPage, pageRange = 2) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.CHECKPOINT_QUIZ.CREATE_QUIZ_FROM_PDF,
      {
        userId,
        bookId,
        currentPage,
        pageRange,
      }
    );
    return response.data;
  },

  /**
   * Submit a quiz answer
   * @param {string} userId - User ID
   * @param {string} quizId - Quiz ID
   * @param {number} selectedIndex - Selected answer index (0-3)
   * @returns {Promise<{attemptId: string, isCorrect: boolean}>}
   */
  async submitQuizAnswer(userId, quizId, selectedIndex) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.CHECKPOINT_QUIZ.SUBMIT_QUIZ_ANSWER,
      {
        userId,
        quizId,
        selectedIndex,
      }
    );
    return response.data;
  },

  /**
   * Get quiz details
   * @param {string} quizId - Quiz ID
   * @returns {Promise<Array>}
   */
  async getQuiz(quizId) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.CHECKPOINT_QUIZ.GET_QUIZ,
      {
        quizId,
      }
    );
    return response.data;
  },

  /**
   * Get all attempts for a specific quiz
   * @param {string} quizId - Quiz ID
   * @returns {Promise<Array>}
   */
  async getQuizAttempts(quizId) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.CHECKPOINT_QUIZ.GET_QUIZ_ATTEMPTS,
      {
        quizId,
      }
    );
    return response.data;
  },

  /**
   * Get all attempts by a specific user
   * @param {string} userId - User ID
   * @returns {Promise<Array>}
   */
  async getUserAttempts(userId) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.CHECKPOINT_QUIZ.GET_USER_ATTEMPTS,
      {
        userId,
      }
    );
    return response.data;
  },
};
