import httpClient from "./httpClient.js";
import { API_CONFIG } from "../config/api.js";

export const annotateService = {
  /**
   * Save an annotation
   * @param {string} userId - User ID
   * @param {string} content - Content being annotated
   * @param {string} keyIdeas - Key ideas from the content
   * @returns {Promise<{annotationId: string}>}
   */
  async saveAnnotation(userId, content, keyIdeas) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.ANNOTATE.SAVE_ANNOTATION,
      {
        userId,
        content,
        keyIdeas,
      }
    );
    return response.data;
  },

  /**
   * Get user annotations for specific content
   * @param {string} userId - User ID
   * @param {string} content - Content to get annotations for
   * @returns {Promise<Array>}
   */
  async getUserAnnotations(userId, content) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.ANNOTATE.GET_USER_ANNOTATIONS,
      {
        userId,
        content,
      }
    );
    return response.data;
  },

  /**
   * Get all annotations by a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>}
   */
  async getAllUserAnnotations(userId) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.ANNOTATE.GET_ALL_USER_ANNOTATIONS,
      {
        userId,
      }
    );
    return response.data;
  },
};
