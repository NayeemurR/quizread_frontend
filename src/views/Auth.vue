<template>
  <div class="auth-view">
    <div class="auth-container">
      <div class="auth-header">
        <h1>QuizRead</h1>
        <p>Your intelligent reading companion</p>
      </div>

      <div class="auth-forms">
        <LoginForm
          v-if="currentForm === 'login'"
          @switch-to-register="currentForm = 'register'"
        />
        <RegisterForm
          v-if="currentForm === 'register'"
          @switch-to-login="currentForm = 'login'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import LoginForm from "../components/LoginForm.vue";
import RegisterForm from "../components/RegisterForm.vue";
import { useAuth } from "../stores/auth.js";

export default {
  name: "Auth",
  components: {
    LoginForm,
    RegisterForm,
  },
  setup() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const currentForm = ref("login");

    onMounted(() => {
      // If user is already authenticated, redirect to library
      if (isAuthenticated.value) {
        router.push("/library");
      }
    });

    return {
      currentForm,
    };
  },
};
</script>

<style scoped>
.auth-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
}

.auth-container {
  width: 100%;
  max-width: 500px;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
  color: white;
}

.auth-header h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.auth-header p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
}

.auth-forms {
  background: white;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
</style>
