<template>
  <div v-if="show" class="annotation-overlay">
    <div class="annotation-popup">
      <div class="annotation-header">
        <h3>📝 Time to Annotate!</h3>
        <p class="annotation-subtitle">
          Reflect on what you've read and capture your key insights
        </p>
      </div>

      <div v-if="loading" class="annotation-loading">
        <div class="spinner"></div>
        <p>Saving your annotation...</p>
      </div>

      <div v-else class="annotation-content">
        <div class="annotation-form">
          <div class="form-group">
            <label for="content" class="form-label">
              What content are you annotating?
            </label>
            <textarea
              id="content"
              v-model="annotationData.content"
              class="form-textarea"
              placeholder="Describe the content you just read (e.g., 'Chapter 3: Introduction to Machine Learning')"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="keyIdeas" class="form-label">
              Key Ideas & Insights *
            </label>
            <textarea
              id="keyIdeas"
              v-model="annotationData.keyIdeas"
              class="form-textarea"
              placeholder="What are the main ideas, insights, or questions you have about this content?"
              rows="4"
              required
            ></textarea>
            <div v-if="errors.keyIdeas" class="error-message">
              {{ errors.keyIdeas }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="!loading" class="annotation-actions">
        <button
          @click="saveAnnotation"
          class="save-btn"
          :disabled="!isFormValid"
        >
          Save Annotation
        </button>
        <button @click="skipAnnotation" class="skip-btn">Skip for Now</button>
      </div>
    </div>
  </div>
</template>

<script>
import { annotateService } from "../services/annotateService.js";

export default {
  name: "AnnotationPopup",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      required: true,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    bookTitle: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: false,
      annotationData: {
        content: "",
        keyIdeas: "",
      },
      errors: {
        keyIdeas: "",
      },
    };
  },
  computed: {
    isFormValid() {
      return this.annotationData.keyIdeas.trim().length > 0;
    },
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.resetForm();
        this.generateDefaultContent();
      }
    },
  },
  methods: {
    resetForm() {
      this.annotationData = {
        content: "",
        keyIdeas: "",
      };
      this.errors = {
        keyIdeas: "",
      };
      this.loading = false;
    },

    generateDefaultContent() {
      // Generate default content based on current page and book
      const pageInfo = this.bookTitle
        ? `Page ${this.currentPage} of "${this.bookTitle}"`
        : `Page ${this.currentPage}`;
      this.annotationData.content = pageInfo;
    },

    validateForm() {
      this.errors = { keyIdeas: "" };

      if (!this.annotationData.keyIdeas.trim()) {
        this.errors.keyIdeas = "Please provide your key ideas and insights";
        return false;
      }

      if (this.annotationData.keyIdeas.trim().length < 10) {
        this.errors.keyIdeas =
          "Please provide more detailed insights (at least 10 characters)";
        return false;
      }

      return true;
    },

    async saveAnnotation() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;

      try {
        const result = await annotateService.saveAnnotation(
          this.userId,
          this.annotationData.content,
          this.annotationData.keyIdeas
        );

        console.log("Annotation saved successfully:", result);

        // Emit success event
        this.$emit("annotation-saved", {
          annotationId: result.annotationId,
          content: this.annotationData.content,
          keyIdeas: this.annotationData.keyIdeas,
        });

        // Close the popup
        this.$emit("close");
      } catch (error) {
        console.error("Failed to save annotation:", error);
        this.$emit("annotation-error", error.message);
      } finally {
        this.loading = false;
      }
    },

    skipAnnotation() {
      this.$emit("annotation-skipped");
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.annotation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.annotation-popup {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.annotation-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 16px 16px 0 0;
  text-align: center;
}

.annotation-header h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.annotation-subtitle {
  margin: 0;
  opacity: 0.9;
  font-size: 1rem;
  line-height: 1.4;
}

.annotation-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
}

.annotation-loading .spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.annotation-loading p {
  color: #6c757d;
  font-size: 1.1rem;
  margin: 0;
}

.annotation-content {
  padding: 2rem;
}

.annotation-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1rem;
}

.form-textarea {
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea::placeholder {
  color: #adb5bd;
  font-style: italic;
}

.error-message {
  color: #dc3545;
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 0.25rem;
}

.annotation-actions {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.save-btn {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 140px;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(40, 167, 69, 0.3);
}

.save-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.skip-btn {
  background: transparent;
  color: #6c757d;
  border: 2px solid #dee2e6;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 140px;
}

.skip-btn:hover {
  border-color: #6c757d;
  color: #495057;
  background: #f8f9fa;
}

/* Responsive Design */
@media (max-width: 768px) {
  .annotation-popup {
    width: 95%;
    margin: 1rem;
  }

  .annotation-header {
    padding: 1.5rem;
  }

  .annotation-header h3 {
    font-size: 1.5rem;
  }

  .annotation-content {
    padding: 1.5rem;
  }

  .annotation-actions {
    padding: 1rem 1.5rem;
    flex-direction: column;
  }

  .save-btn,
  .skip-btn {
    width: 100%;
  }
}
</style>
