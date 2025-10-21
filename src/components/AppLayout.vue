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
        <span class="user-info">Demo User</span>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: "AppLayout",
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

.user-info {
  color: #2c3e50;
  font-weight: 500;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-radius: 20px;
  font-size: 0.9rem;
}

.main-content {
  min-height: calc(100vh - 80px);
}
</style>
