import httpClient from "./httpClient.js";
import { API_CONFIG } from "../config/api.js";

export const focusTimerService = {
  /**
   * Start a new timer
   * @param {number} durationMs - Duration in milliseconds
   * @param {string} phase - Phase type ("reading" or "break")
   * @returns {Promise<{timerId: string}>}
   */
  async start(durationMs, phase) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.FOCUS_TIMER.START,
      {
        durationMs,
        phase,
      }
    );
    return response.data;
  },

  /**
   * Pause an active timer
   * @param {string} timerId - Timer ID
   * @returns {Promise<{}>}
   */
  async pause(timerId) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.FOCUS_TIMER.PAUSE,
      {
        timerId,
      }
    );
    return response.data;
  },

  /**
   * Resume a paused timer
   * @param {string} timerId - Timer ID
   * @returns {Promise<{}>}
   */
  async resume(timerId) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.FOCUS_TIMER.RESUME,
      {
        timerId,
      }
    );
    return response.data;
  },

  /**
   * Expire an active timer
   * @param {string} timerId - Timer ID
   * @returns {Promise<{}>}
   */
  async expire(timerId) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.FOCUS_TIMER.EXPIRE,
      {
        timerId,
      }
    );
    return response.data;
  },

  /**
   * Get timer details
   * @param {string} timerId - Timer ID
   * @returns {Promise<Array>}
   */
  async getTimer(timerId) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.FOCUS_TIMER.GET_TIMER,
      {
        timerId,
      }
    );
    return response.data;
  },

  /**
   * Get all active timers
   * @returns {Promise<Array>}
   */
  async getActiveTimers() {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.FOCUS_TIMER.GET_ACTIVE_TIMERS,
      {}
    );
    return response.data;
  },

  /**
   * Get all timers with a specific phase
   * @param {string} phase - Phase type ("reading" or "break")
   * @returns {Promise<Array>}
   */
  async getTimersByPhase(phase) {
    const response = await httpClient.post(
      API_CONFIG.ENDPOINTS.FOCUS_TIMER.GET_TIMERS_BY_PHASE,
      {
        phase,
      }
    );
    return response.data;
  },
};
