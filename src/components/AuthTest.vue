<template>
  <div class="auth-test">
    <h3>Authentication Test</h3>
    <div class="test-info">
      <p><strong>Authenticated:</strong> {{ isAuthenticated }}</p>
      <p><strong>User Email:</strong> {{ userEmail }}</p>
      <p><strong>User ID:</strong> {{ userId }}</p>
      <p><strong>Token:</strong> {{ authToken ? "Present" : "None" }}</p>
    </div>

    <div class="test-actions">
      <button
        @click="testGetUserInfo"
        :disabled="!isAuthenticated"
        class="test-btn"
      >
        Test Get User Info
      </button>
      <button @click="testLogout" :disabled="!isAuthenticated" class="test-btn">
        Test Logout
      </button>
      <button @click="testApiConnectivity" class="test-btn">
        Test API Connectivity
      </button>
    </div>

    <div v-if="userInfo" class="user-info-display">
      <h4>User Info from API:</h4>
      <pre>{{ JSON.stringify(userInfo, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useAuth } from "../stores/auth.js";

export default {
  name: "AuthTest",
  setup() {
    const {
      isAuthenticated,
      userEmail,
      userId,
      authToken,
      getUserInfo,
      logout,
    } = useAuth();
    const userInfo = ref(null);

    const testGetUserInfo = async () => {
      try {
        const info = await getUserInfo();
        userInfo.value = info;
      } catch (error) {
        console.error("Error getting user info:", error);
        userInfo.value = { error: error.message };
      }
    };

    const testLogout = () => {
      logout();
      userInfo.value = null;
    };

    const testApiConnectivity = async () => {
      try {
        // Test API connectivity by calling getAllUsers
        const { userAuthService } = await import(
          "../services/userAuthService.js"
        );
        const users = await userAuthService.getAllUsers();
        userInfo.value = {
          apiTest: "SUCCESS",
          message: "API is reachable",
          userCount: users.length,
          users: users,
        };
      } catch (error) {
        userInfo.value = {
          apiTest: "FAILED",
          message: "API is not reachable",
          error: error.message,
        };
      }
    };

    return {
      isAuthenticated,
      userEmail,
      userId,
      authToken,
      userInfo,
      testGetUserInfo,
      testLogout,
      testApiConnectivity,
    };
  },
};
</script>

<style scoped>
.auth-test {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 1rem 0;
  background: #f9f9f9;
}

.test-info {
  margin-bottom: 1rem;
}

.test-info p {
  margin: 0.5rem 0;
}

.test-actions {
  margin-bottom: 1rem;
}

.test-btn {
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.test-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.user-info-display {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}

pre {
  background: #f8f9fa;
  padding: 0.5rem;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
