<template>
  <div class="register-form">
    <div class="form-container">
      <h2>Register</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="Enter your email"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="password">Password:</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            placeholder="Enter your password"
            :disabled="loading"
            minlength="6"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password:</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            placeholder="Confirm your password"
            :disabled="loading"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="success" class="success-message">
          Registration successful! Redirecting to login...
        </div>

        <button
          type="submit"
          :disabled="loading || !isFormValid"
          class="submit-btn"
        >
          {{ loading ? "Creating Account..." : "Register" }}
        </button>
      </form>

      <div class="form-footer">
        <p>
          Already have an account?
          <button @click="$emit('switch-to-login')" class="link-btn">
            Login here
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from "vue";
import { useAuth } from "../stores/auth.js";
import { useRouter } from "vue-router";

export default {
  name: "RegisterForm",
  emits: ["switch-to-login"],
  setup() {
    const { register } = useAuth();
    const router = useRouter();

    const loading = ref(false);
    const error = ref("");
    const success = ref(false);

    const form = reactive({
      email: "",
      password: "",
      confirmPassword: "",
    });

    const isFormValid = computed(() => {
      return (
        form.email &&
        form.password &&
        form.confirmPassword &&
        form.password === form.confirmPassword &&
        form.password.length >= 6
      );
    });

    const handleRegister = async () => {
      if (!isFormValid.value) {
        error.value = "Please fill in all fields and ensure passwords match";
        return;
      }

      loading.value = true;
      error.value = "";
      success.value = false;

      try {
        const result = await register(form.email, form.password);

        if (result.success) {
          success.value = true;
          // Redirect to library after successful registration
          setTimeout(() => {
            router.push("/library");
          }, 1500);
        } else {
          error.value = result.error || "Registration failed";
        }
      } catch (err) {
        error.value = "An unexpected error occurred";
        console.error("Registration error:", err);
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      error,
      success,
      isFormValid,
      handleRegister,
    };
  },
};
</script>

<style scoped>
.register-form {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.form-container {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  background-color: #fdf2f2;
  padding: 0.75rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  border: 1px solid #fecaca;
}

.success-message {
  color: #27ae60;
  background-color: #f0f9f0;
  padding: 0.75rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  border: 1px solid #a8e6a8;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.form-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

.link-btn {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  text-decoration: underline;
  font-size: inherit;
}

.link-btn:hover {
  color: #764ba2;
}
</style>
