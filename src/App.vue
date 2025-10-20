<template>
  <div id="app">
    <header class="app-header">
      <h1>QuizRead Frontend</h1>
      <p>Welcome to your Vue.js application!</p>
    </header>

    <main class="app-main">
      <div class="welcome-card">
        <h2>Getting Started</h2>
        <p>This is a Vue.js application initialized with Vite.</p>
        <p>Start building your quiz application here!</p>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      message: "Hello Vue!",
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.app-header {
  text-align: center;
  padding: 2rem 0;
  color: white;
}

.app-header h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 300;
}

.app-header p {
  margin: 0.5rem 0 0 0;
  font-size: 1.2rem;
  opacity: 0.9;
}

.app-main {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.welcome-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.welcome-card h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.welcome-card p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.welcome-card p:last-child {
  margin-bottom: 0;
}
</style>
