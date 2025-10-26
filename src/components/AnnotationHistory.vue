<template>
  <div class="annotation-history">
    <div class="history-header">
      <h3>📚 Your Annotations</h3>
      <p class="history-subtitle">
        Review your reading insights and reflections
      </p>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading your annotations...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <div class="error-icon">❌</div>
      <h4>Error Loading Annotations</h4>
      <p>{{ error }}</p>
      <button @click="loadAnnotations" class="retry-btn">Retry</button>
    </div>

    <div v-else-if="annotations.length === 0" class="empty-state">
      <div class="empty-icon">📝</div>
      <h4>No Annotations Yet</h4>
      <p>Start reading and make your first annotation to see it here!</p>
    </div>

    <div v-else class="annotations-list">
      <div
        v-for="annotation in annotations"
        :key="annotation._id"
        class="annotation-card"
      >
        <div class="annotation-header">
          <div class="annotation-meta">
            <span class="annotation-date">
              {{ formatDate(annotation.createdAt) }}
            </span>
          </div>
        </div>

        <div class="annotation-content">
          <div class="content-section">
            <h5 class="section-title">Content</h5>
            <p class="content-text">{{ annotation.content }}</p>
          </div>

          <div class="key-ideas-section">
            <h5 class="section-title">Key Ideas & Insights</h5>
            <p class="key-ideas-text">{{ annotation.keyIdeas }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="annotations.length > 0" class="history-footer">
      <p class="annotation-count">
        {{ annotations.length }} annotation{{
          annotations.length !== 1 ? "s" : ""
        }}
        total
      </p>
    </div>
  </div>
</template>

<script>
import { annotateService } from "../services/annotateService.js";

export default {
  name: "AnnotationHistory",
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      annotations: [],
      loading: true,
      error: null,
    };
  },
  async mounted() {
    await this.loadAnnotations();
  },
  methods: {
    async loadAnnotations() {
      this.loading = true;
      this.error = null;

      try {
        const annotations = await annotateService.getAllUserAnnotations(
          this.userId
        );
        this.annotations = annotations || [];
        console.log("Loaded annotations:", this.annotations);
      } catch (error) {
        console.error("Failed to load annotations:", error);
        this.error = error.message || "Failed to load annotations";
      } finally {
        this.loading = false;
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);

      if (diffInHours < 1) {
        return "Just now";
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)} hour${
          Math.floor(diffInHours) !== 1 ? "s" : ""
        } ago`;
      } else if (diffInHours < 48) {
        return "Yesterday";
      } else {
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    },
  },
};
</script>

<style scoped>
.annotation-history {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-height: 600px;
  display: flex;
  flex-direction: column;
}

.history-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  text-align: center;
}

.history-header h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.history-subtitle {
  margin: 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
  flex: 1;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
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

.loading-state p,
.error-state p,
.empty-state p {
  color: #6c757d;
  margin: 0;
}

.error-icon,
.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.error-state h4,
.empty-state h4 {
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.retry-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
  font-size: 0.9rem;
  transition: background 0.3s;
}

.retry-btn:hover {
  background: #5a6fd8;
}

.annotations-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.annotation-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.25rem;
  transition: all 0.3s;
}

.annotation-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.annotation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.annotation-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.annotation-date {
  color: #6c757d;
  font-size: 0.85rem;
  font-weight: 500;
}

.annotation-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.content-section,
.key-ideas-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-title {
  margin: 0;
  color: #2c3e50;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.content-text,
.key-ideas-text {
  margin: 0;
  color: #495057;
  line-height: 1.5;
  font-size: 0.95rem;
}

.key-ideas-text {
  font-style: italic;
  background: white;
  padding: 0.75rem;
  border-radius: 6px;
  border-left: 3px solid #667eea;
}

.history-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
  text-align: center;
}

.annotation-count {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .annotation-history {
    max-height: 500px;
  }

  .history-header {
    padding: 1rem;
  }

  .history-header h3 {
    font-size: 1.3rem;
  }

  .annotations-list {
    padding: 0.75rem;
  }

  .annotation-card {
    padding: 1rem;
  }

  .annotation-content {
    gap: 0.75rem;
  }
}

/* Custom scrollbar */
.annotations-list::-webkit-scrollbar {
  width: 6px;
}

.annotations-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.annotations-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.annotations-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
