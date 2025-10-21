<template>
  <div class="app-layout">
    <nav class="navbar">
      <div class="nav-brand">
        <h1>QuizRead</h1>
      </div>
      <div class="nav-links">
        <router-link to="/library" class="nav-link"> 📚 Library </router-link>
        <router-link to="/reading" class="nav-link"> 📖 Reading </router-link>
        <router-link to="/progress" class="nav-link"> 📊 Progress </router-link>
      </div>
      <div class="nav-user">
        <div class="user-dropdown">
          <button @click="toggleDropdown" class="user-info">
            {{ userEmail || "User" }} ▼
          </button>
          <div v-if="showDropdown" class="dropdown-menu">
            <div class="dropdown-item">
              <span class="user-email">{{ userEmail }}</span>
            </div>
            <div class="dropdown-divider"></div>
            <button @click="handleLogout" class="dropdown-item logout-btn">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../stores/auth.js";

export default {
  name: "AppLayout",
  setup() {
    const router = useRouter();
    const { isAuthenticated, userEmail, logout } = useAuth();
    const showDropdown = ref(false);

    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value;
    };

    const handleLogout = () => {
      logout();
      router.push("/auth");
      showDropdown.value = false;
    };

    const closeDropdown = (event) => {
      if (!event.target.closest(".user-dropdown")) {
        showDropdown.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener("click", closeDropdown);
    });

    onUnmounted(() => {
      document.removeEventListener("click", closeDropdown);
    });

    return {
      isAuthenticated,
      userEmail,
      showDropdown,
      toggleDropdown,
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

.user-dropdown {
  position: relative;
}

.user-info {
  color: #2c3e50;
  font-weight: 500;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-radius: 20px;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-info:hover {
  background: #e9ecef;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 1000;
  margin-top: 0.5rem;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background: #f8f9fa;
}

.user-email {
  color: #6c757d;
  font-size: 0.85rem;
}

.dropdown-divider {
  height: 1px;
  background: #e9ecef;
  margin: 0.25rem 0;
}

.logout-btn {
  color: #dc3545;
}

.logout-btn:hover {
  background: #f8d7da;
  color: #721c24;
}

.main-content {
  min-height: calc(100vh - 80px);
}
</style>
