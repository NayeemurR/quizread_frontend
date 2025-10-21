import httpClient from "./httpClient.js";
import { API_CONFIG } from "../config/api.js";

export const readingProgressService = {
  /**
   * Initialize a new reading session
   * @param {string} userId - User ID
   * @param {string} bookId - Book ID
   * @param {number} totalPages - Total pages in the book
   * @param {number} quizInterval - Pages between quiz triggers
   * @param {number} annotationInterval - Pages between annotation triggers
   * @returns {Promise<{sessionId: string}>}
   */
  async initializeProgress(
    userId,
    bookId,
    totalPages,
    quizInterval,
    annotationInterval
  ) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.READING_PROGRESS.INITIALIZE_PROGRESS,
      {
        userId,
        bookId,
        totalPages,
        quizInterval,
        annotationInterval,
      }
    );
    return response.data;
  },

  /**
   * Update reading progress
   * @param {string} sessionId - Session ID
   * @param {number} newPage - New current page
   * @returns {Promise<{}>}
   */
  async updateProgress(sessionId, newPage) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.READING_PROGRESS.UPDATE_PROGRESS,
      {
        sessionId,
        newPage,
      }
    );
    return response.data;
  },

  /**
   * Check if quiz should be triggered
   * @param {string} sessionId - Session ID
   * @returns {Promise<{shouldTrigger: boolean}>}
   */
  async triggerQuiz(sessionId) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.READING_PROGRESS.TRIGGER_QUIZ,
      {
        sessionId,
      }
    );
    return response.data;
  },

  /**
   * Check if annotation should be triggered
   * @param {string} sessionId - Session ID
   * @returns {Promise<{shouldTrigger: boolean}>}
   */
  async triggerAnnotation(sessionId) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.READING_PROGRESS.TRIGGER_ANNOTATION,
      {
        sessionId,
      }
    );
    return response.data;
  },

  /**
   * Record that a quiz was triggered
   * @param {string} sessionId - Session ID
   * @returns {Promise<{}>}
   */
  async recordQuizTriggered(sessionId) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.READING_PROGRESS.RECORD_QUIZ_TRIGGERED,
      {
        sessionId,
      }
    );
    return response.data;
  },

  /**
   * Record that an annotation was triggered
   * @param {string} sessionId - Session ID
   * @returns {Promise<{}>}
   */
  async recordAnnotationTriggered(sessionId) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.READING_PROGRESS.RECORD_ANNOTATION_TRIGGERED,
      {
        sessionId,
      }
    );
    return response.data;
  },

  /**
   * Pause reading session
   * @param {string} sessionId - Session ID
   * @returns {Promise<{}>}
   */
  async pauseReading(sessionId) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.READING_PROGRESS.PAUSE_READING,
      {
        sessionId,
      }
    );
    return response.data;
  },

  /**
   * Resume reading session
   * @param {string} sessionId - Session ID
   * @returns {Promise<{}>}
   */
  async resumeReading(sessionId) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.READING_PROGRESS.RESUME_READING,
      {
        sessionId,
      }
    );
    return response.data;
  },

  /**
   * Get reading session details
   * @param {string} sessionId - Session ID
   * @returns {Promise<Array>}
   */
  async getReadingSession(sessionId) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.READING_PROGRESS.GET_READING_SESSION,
      {
        sessionId,
      }
    );
    return response.data;
  },

  /**
   * Get all reading sessions for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>}
   */
  async getUserSessions(userId) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.READING_PROGRESS.GET_USER_SESSIONS,
      {
        userId,
      }
    );
    return response.data;
  },

  /**
   * Get all reading sessions for a book
   * @param {string} bookId - Book ID
   * @returns {Promise<Array>}
   */
  async getBookSessions(bookId) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.READING_PROGRESS.GET_BOOK_SESSIONS,
      {
        bookId,
      }
    );
    return response.data;
  },

  /**
   * Get all active reading sessions
   * @returns {Promise<Array>}
   */
  async getActiveSessions() {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.READING_PROGRESS.GET_ACTIVE_SESSIONS,
      {}
    );
    return response.data;
  },
};
