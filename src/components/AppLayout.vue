<template>
  <div class="app-layout">
    <nav class="navbar">
      <div class="nav-brand">
        <h1>QuizRead</h1>
      </div>
      <div class="nav-user">
        <div v-if="!isAuthenticated" class="auth-link">
          <router-link to="/auth" class="nav-link">Sign In</router-link>
        </div>
        <div v-else class="user-info">
          <span class="user-email">{{ userEmail }}</span>
          <button @click="handleLogout" class="sign-out-btn">Sign Out</button>
        </div>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { useAuth } from "../stores/auth.js";

export default {
  name: "AppLayout",
  setup() {
    const router = useRouter();
    const { isAuthenticated, userEmail, logout } = useAuth();

    const handleLogout = () => {
      logout();
      router.push("/auth");
    };

    return {
      isAuthenticated,
      userEmail,
      handleLogout,
    };
  },
};
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: #f8f9fa;
}

.navbar {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-brand h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #6c757d;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: all 0.3s;
}

.nav-link:hover {
  color: #667eea;
  background: #f8f9fa;
}

.nav-link.router-link-active {
  color: #667eea;
  background: #e3f2fd;
}

.nav-user {
  display: flex;
  align-items: center;
}

.auth-link {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-email {
  color: #2c3e50;
  font-weight: 500;
  font-size: 0.9rem;
}

.sign-out-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sign-out-btn:hover {
  background: #c82333;
  transform: translateY(-1px);
}

.main-content {
  min-height: calc(100vh - 80px);
}
</style>
