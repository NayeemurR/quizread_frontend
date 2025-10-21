import { ref, computed } from "vue";
import { userAuthService } from "../services/userAuthService.js";

// Global authentication state
const isAuthenticated = ref(false);
const currentUser = ref(null);
const authToken = ref(localStorage.getItem("authToken") || null);

// Initialize auth state from localStorage
if (authToken.value) {
  isAuthenticated.value = true;
  // Try to get user info from token or localStorage
  const storedUser = localStorage.getItem("currentUser");
  if (storedUser) {
    try {
      currentUser.value = JSON.parse(storedUser);
    } catch (e) {
      console.error("Error parsing stored user:", e);
      clearAuth();
    }
  }
}

export function useAuth() {
  /**
   * Register a new user
   * @param {string} email - User's email
   * @param {string} password - User's password (will be hashed)
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const register = async (email, password) => {
    try {
      // Hash the password
      const passwordHash = await hashPassword(password);

      // Call the API
      const response = await userAuthService.register(email, passwordHash);

      // Validate the response - ensure we got a valid userId
      if (!response || !response.userId) {
        return {
          success: false,
          error: "Registration failed. Please try again.",
        };
      }

      // Store user info
      currentUser.value = {
        userId: response.userId,
        email: email,
      };

      // Generate a simple token (in a real app, this would come from the server)
      const token = generateToken(response.userId, email);
      authToken.value = token;
      isAuthenticated.value = true;

      // Persist to localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("currentUser", JSON.stringify(currentUser.value));

      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);

      // Handle different types of errors
      let errorMessage = "Registration failed";

      if (error.response?.status === 409) {
        errorMessage = "Email already exists. Please use a different email.";
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid email format or password requirements not met.";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Login a user
   * @param {string} email - User's email
   * @param {string} password - User's password (will be hashed)
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const login = async (email, password) => {
    try {
      // Hash the password
      const passwordHash = await hashPassword(password);

      // Call the API
      const response = await userAuthService.login(email, passwordHash);

      // Validate the response - ensure we got a valid userId
      if (!response || !response.userId) {
        return {
          success: false,
          error: "Invalid credentials. Please check your email and password.",
        };
      }

      // Store user info
      currentUser.value = {
        userId: response.userId,
        email: email,
      };

      // Generate a simple token (in a real app, this would come from the server)
      const token = generateToken(response.userId, email);
      authToken.value = token;
      isAuthenticated.value = true;

      // Persist to localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("currentUser", JSON.stringify(currentUser.value));

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);

      // Handle different types of errors
      let errorMessage = "Login failed";

      if (error.response?.status === 401) {
        errorMessage =
          "Invalid credentials. Please check your email and password.";
      } else if (error.response?.status === 404) {
        errorMessage = "User not found. Please check your email.";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Logout the current user
   */
  const logout = () => {
    clearAuth();
  };

  /**
   * Clear authentication state
   */
  const clearAuth = () => {
    isAuthenticated.value = false;
    currentUser.value = null;
    authToken.value = null;
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
  };

  /**
   * Hash a password using Web Crypto API
   * @param {string} password - Plain text password
   * @returns {Promise<string>} - Hashed password
   */
  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  /**
   * Generate a simple token (in production, this should be done server-side)
   * @param {string} userId - User ID
   * @param {string} email - User email
   * @returns {string} - Token
   */
  const generateToken = (userId, email) => {
    const payload = {
      userId,
      email,
      timestamp: Date.now(),
    };
    return btoa(JSON.stringify(payload));
  };

  /**
   * Get current user info
   * @returns {Promise<Object|null>}
   */
  const getUserInfo = async () => {
    if (!currentUser.value?.userId) return null;

    try {
      const userData = await userAuthService.getUser(currentUser.value.userId);
      return userData[0] || null;
    } catch (error) {
      console.error("Error fetching user info:", error);
      return null;
    }
  };

  // Computed properties
  const userEmail = computed(() => currentUser.value?.email || "");
  const userId = computed(() => currentUser.value?.userId || "");

  return {
    // State
    isAuthenticated: computed(() => isAuthenticated.value),
    currentUser: computed(() => currentUser.value),
    authToken: computed(() => authToken.value),
    userEmail,
    userId,

    // Actions
    register,
    login,
    logout,
    getUserInfo,
  };
}
