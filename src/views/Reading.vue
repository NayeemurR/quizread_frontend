<template>
  <div class="reading-page">
    <div class="reading-header">
      <h1 class="reading-title">Reading Page</h1>
      <button @click="goBack" class="back-btn">← Back to Library</button>
    </div>

    <div class="reading-content">
      <!-- Main Book Display Area -->
      <div class="book-display">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading book...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <div class="error-icon">❌</div>
          <h3>Error Loading Book</h3>
          <p>{{ error }}</p>
          <button @click="retryLoad" class="retry-btn">Retry</button>
        </div>

        <div v-else class="pdf-container">
          <iframe
            v-if="book.storageUrl && !pdfError"
            :key="currentPage"
            :src="getPdfUrl(book.storageUrl, currentPage)"
            class="pdf-viewer"
            frameborder="0"
            @load="onPdfLoad"
            @error="onPdfError"
          ></iframe>
          <div v-else-if="pdfError" class="pdf-error">
            <div class="error-icon">🔒</div>
            <h3>PDF Access Restricted</h3>
            <p>{{ pdfError }}</p>
            <button @click="retryPdfLoad" class="retry-btn">Retry</button>
            <button @click="downloadPdf" class="download-btn">
              Download PDF
            </button>
          </div>
          <div v-else class="no-pdf">
            <div class="no-pdf-icon">📄</div>
            <p>PDF not available</p>
          </div>
        </div>
      </div>

      <!-- Right Sidebar -->
      <div class="reading-sidebar">
        <!-- Timer Section -->
        <div class="timer-section">
          <h3 v-if="!isBreakActive">TIME REMAINING</h3>
          <h3 v-else class="break-timer-title">BREAK TIME</h3>
          <div class="timer-display" :class="{ 'break-timer': isBreakActive }">
            {{
              isBreakActive
                ? formatTime(breakTimeRemaining)
                : formatTime(timeRemaining)
            }}
          </div>
          <div v-if="!isBreakActive" class="timer-controls">
            <button
              @click="toggleTimer"
              :class="['timer-btn', { active: isTimerRunning }]"
            >
              {{ isTimerRunning ? "Pause" : "Start" }}
            </button>
            <button @click="resetTimer" class="timer-btn secondary">
              Reset
            </button>
          </div>
          <div v-else class="break-message">
            <p>Take a break! Navigation is disabled.</p>
          </div>
        </div>

        <!-- Progress Section -->
        <div class="progress-section">
          <h3>PROGRESS</h3>
          <div class="progress-display">{{ currentPage }}/{{ totalPages }}</div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: progressPercentage + '%' }"
            ></div>
          </div>
        </div>

        <!-- Current Page Display -->
        <div class="page-display-section">
          <h3>PAGE #</h3>
          <div class="current-page-display">{{ currentPage }}</div>
          <div class="page-info">
            <span class="page-label">Current Page</span>
          </div>
        </div>

        <!-- Page Navigation -->
        <div class="page-section">
          <h3>PAGE NAVIGATION</h3>
          <div class="page-controls">
            <button
              @click="goToPreviousPage"
              :disabled="currentPage <= 1 || isBreakActive"
              class="page-btn"
            >
              ← Previous
            </button>
            <input
              v-model.number="pageInput"
              @keyup.enter="goToPage"
              type="number"
              :min="1"
              :max="totalPages"
              :disabled="isBreakActive"
              class="page-input"
              placeholder="Page #"
            />
            <button
              @click="goToNextPage"
              :disabled="
                currentPage >= totalPages || !isTimerRunning || isBreakActive
              "
              class="page-btn"
            >
              Next →
            </button>
          </div>
        </div>

        <!-- Reading Stats -->
        <div class="stats-section">
          <h3>READING STATS</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">Time Read:</span>
              <span class="stat-value">{{ formatTime(timeRead) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Pages Read:</span>
              <span class="stat-value">{{ pagesRead }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Reading Speed:</span>
              <span class="stat-value">{{ readingSpeed }} p/min</span>
            </div>
          </div>
        </div>

        <!-- Annotation History -->
        <div class="annotation-history-section">
          <AnnotationHistory :userId="userId" :bookId="$route.params.bookId" />
        </div>
      </div>
    </div>

    <!-- Quiz Popup -->
    <div v-if="showQuiz" class="quiz-overlay">
      <div class="quiz-popup">
        <div class="quiz-header">
          <h3>Quiz ⏳</h3>
        </div>
        <div v-if="quizLoading" class="quiz-loading">
          <div class="spinner"></div>
          <p>Generating quiz...</p>
        </div>
        <div v-else class="quiz-content">
          <p class="quiz-question">{{ currentQuiz.question }}</p>
          <div class="quiz-options">
            <label
              v-for="(option, index) in currentQuiz.options"
              :key="index"
              class="quiz-option"
            >
              <input
                type="radio"
                :name="'quiz-answer'"
                :value="index"
                v-model="selectedAnswer"
              />
              <span class="option-text">{{ option }}</span>
            </label>
          </div>
        </div>
        <div v-if="!quizLoading" class="quiz-actions">
          <button
            @click="submitQuiz"
            class="submit-btn"
            :disabled="selectedAnswer === null"
          >
            Submit
          </button>
        </div>
      </div>
    </div>

    <!-- Annotation Popup -->
    <AnnotationPopup
      :show="showAnnotation"
      :userId="userId"
      :bookId="$route.params.bookId"
      :currentPage="currentPage"
      :bookTitle="book.title"
      @annotation-saved="onAnnotationSaved"
      @annotation-skipped="onAnnotationSkipped"
      @annotation-error="onAnnotationError"
      @close="closeAnnotation"
    />
  </div>
</template>

<script>
import { apiService } from "../services/apiService.js";
import { checkpointQuizService } from "../services/checkpointQuizService.js";
import { useAuth } from "../stores/auth.js";
import { useNotifications } from "../composables/useNotifications.js";
import AnnotationPopup from "../components/AnnotationPopup.vue";
import AnnotationHistory from "../components/AnnotationHistory.vue";

export default {
  name: "Reading",
  components: {
    AnnotationPopup,
    AnnotationHistory,
  },
  setup() {
    const { userId } = useAuth();
    const { showSuccess, showError, showInfo } = useNotifications();
    return {
      userId,
      showSuccess,
      showError,
      showInfo,
    };
  },
  data() {
    return {
      book: {},
      loading: true,
      error: null,
      pdfError: null,

      // Timer state
      isTimerRunning: false,
      timeRemaining: 0.1 * 60, // 6 seconds for testing
      timeRead: 0,
      timerInterval: null,

      // Break timer state
      isBreakActive: false,
      breakTimeRemaining: 0.2 * 60, // 10 seconds for testing

      // Page state
      currentPage: 1,
      totalPages: 0,
      pageInput: 1,
      pagesRead: 0,

      // Reading session
      sessionId: null,
      startTime: null,

      // Quiz state
      showQuiz: false,
      currentQuiz: {
        quizId: null,
        question: "",
        options: [],
        correctAnswer: 0,
      },
      selectedAnswer: null,
      quizInterval: 3, // Quiz every 3 pages
      quizLoading: false,

      // Annotation state
      showAnnotation: false,
      annotationError: null,
    };
  },
  computed: {
    progressPercentage() {
      if (this.totalPages === 0) return 0;
      return Math.round((this.currentPage / this.totalPages) * 100);
    },
    readingSpeed() {
      if (this.timeRead === 0) return 0;
      const minutes = this.timeRead / 60;
      return Math.round(this.pagesRead / minutes);
    },
  },
  async mounted() {
    await this.loadBook();
    this.initializeReadingSession();
  },
  beforeUnmount() {
    this.cleanupTimer();
  },
  methods: {
    async loadBook() {
      this.loading = true;
      this.error = null;

      try {
        // Get book ID from route params
        const bookId = this.$route.params.bookId;

        if (!bookId) {
          throw new Error("No book ID provided");
        }

        // Load book details
        const books = await apiService.library.getBookDetails(bookId);

        // Handle different response structures
        let bookData = null;

        if (Array.isArray(books) && books.length > 0) {
          // Standard array response
          bookData = books[0];
        } else if (books && typeof books === "object" && books._id) {
          // Direct object response
          bookData = books;
        } else {
          throw new Error("Book not found");
        }

        if (bookData) {
          this.book = bookData;
          this.totalPages = this.book.totalPages || 100; // Default if not available
        } else {
          throw new Error("Book not found");
        }
      } catch (error) {
        console.error("Failed to load book:", error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async initializeReadingSession() {
      try {
        // First, check if there's an existing reading session for this book and user
        const existingSessions =
          await apiService.readingProgress.getUserSessions(this.userId);

        // Find existing session for this specific book
        const existingSession = existingSessions.find(
          (session) => session.bookId === this.$route.params.bookId
        );

        if (existingSession) {
          // Resume existing session
          console.log("Found existing reading session, resuming...");
          this.sessionId = existingSession._id;
          this.currentPage = existingSession.currentPage;
          this.pageInput = existingSession.currentPage;
          this.pagesRead = existingSession.currentPage;
          this.startTime = new Date(existingSession.startTime).getTime();

          // Resume the session if it was paused
          if (!existingSession.isActive) {
            await apiService.readingProgress.resumeReading(this.sessionId);
          }

          console.log(`Resumed reading session at page ${this.currentPage}`);
        } else {
          // Create new session
          console.log("No existing session found, creating new one...");
          const result = await apiService.readingProgress.initializeProgress(
            this.userId, // Current user ID
            this.$route.params.bookId,
            this.totalPages,
            2, // Quiz interval (every 2 pages)
            3 // Annotation interval (every 3 pages)
          );

          this.sessionId = result.sessionId;
          this.currentPage = 1; // Start at page 1 for new sessions
          this.pageInput = 1;
          this.pagesRead = 0;
          this.startTime = Date.now();

          console.log("Created new reading session");
        }
      } catch (error) {
        console.error("Failed to initialize reading session:", error);
      }
    },

    toggleTimer() {
      if (this.isTimerRunning) {
        this.pauseTimer();
      } else {
        this.startTimer();
      }
    },

    startTimer() {
      this.isTimerRunning = true;
      this.startTime = Date.now();

      this.timerInterval = setInterval(() => {
        this.timeRemaining--;
        this.timeRead++;

        if (this.timeRemaining <= 0) {
          this.timerFinished();
        }
      }, 1000);
    },

    pauseTimer() {
      this.isTimerRunning = false;
      this.cleanupTimer();
    },

    resetTimer() {
      this.isTimerRunning = false;
      this.isBreakActive = false;
      this.cleanupTimer();
      this.timeRemaining = 25 * 60; // Reset to 25 minutes
      this.breakTimeRemaining = 5 * 60; // Reset break timer
      this.timeRead = 0;
    },

    timerFinished() {
      this.isTimerRunning = false;
      this.cleanupTimer();
      this.startBreakTimer();
    },

    startBreakTimer() {
      this.isBreakActive = true;
      this.breakTimeRemaining = 0.2 * 60; // 5 minutes

      this.timerInterval = setInterval(() => {
        this.breakTimeRemaining--;

        if (this.breakTimeRemaining <= 0) {
          this.breakFinished();
        }
      }, 1000);
    },

    breakFinished() {
      this.isBreakActive = false;
      this.cleanupTimer();
      this.timeRemaining = 25 * 60; // Reset main timer to 25 minutes
      this.showInfo("Break Time Over", "You can now continue reading!");
    },

    cleanupTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },

    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    },

    goToPage() {
      if (this.pageInput >= 1 && this.pageInput <= this.totalPages) {
        this.currentPage = this.pageInput;
        this.updateReadingProgress();
      }
    },

    goToPreviousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.pageInput = this.currentPage;
        this.updateReadingProgress();
      }
    },

    goToNextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.pageInput = this.currentPage;
        this.updateReadingProgress();
      }
    },

    async updateReadingProgress() {
      if (this.sessionId) {
        try {
          await apiService.readingProgress.updateProgress(
            this.sessionId,
            this.currentPage
          );

          // Update pages read
          this.pagesRead = this.currentPage;

          // Check if quiz should be triggered (every 2 pages)
          // if (this.currentPage % this.quizInterval === 0) {
          //   this.triggerQuiz();
          // }
          const quizTrigger = await apiService.readingProgress.triggerQuiz(
            this.sessionId
          );
          if (quizTrigger.shouldTrigger) {
            this.triggerQuiz();
          }

          // Check if annotation should be triggered
          const annotationTrigger =
            await apiService.readingProgress.triggerAnnotation(this.sessionId);
          if (annotationTrigger.shouldTrigger) {
            this.triggerAnnotation();
          }
        } catch (error) {
          console.error("Failed to update reading progress:", error);
        }
      }
    },

    async triggerQuiz() {
      this.quizLoading = true;
      // hello
      try {
        // Record that a quiz was triggered at the current page
        await apiService.readingProgress.recordQuizTriggered(this.sessionId);

        // Create quiz directly from PDF content using the new endpoint
        const quizResponse = await checkpointQuizService.createQuizFromPDF(
          this.userId, // Current user ID
          this.$route.params.bookId,
          this.currentPage,
          2 // Extract last 2 pages
        );

        console.log("quiz response,", quizResponse);

        if ("error" in quizResponse) {
          console.error("Failed to create quiz from PDF:", quizResponse.error);
          this.showFallbackQuiz();
          return;
        }

        this.currentQuiz = {
          quizId: quizResponse.quiz._id,
          question: quizResponse.quiz.question,
          options: quizResponse.quiz.answers,
          correctAnswer: quizResponse.quiz.correctIndex,
        };
        this.selectedAnswer = null;
        this.showQuiz = true;

        // }
      } catch (error) {
        console.error("Failed to create quiz:", error);
        this.showFallbackQuiz();
      } finally {
        this.quizLoading = false;
      }
    },

    showFallbackQuiz() {
      // Fallback to dummy quiz if API fails
      this.currentQuiz = {
        quizId: null,
        question: `What is the main topic discussed on the last 2 pages?`,
        options: [
          "The introduction of new concepts",
          "A detailed analysis of previous topics",
          "Practical applications and examples",
          "A summary of key points",
        ],
        correctAnswer: 0,
      };
      this.selectedAnswer = null;
      this.showQuiz = true;
    },

    async submitQuiz() {
      if (this.selectedAnswer === null) return;

      try {
        if (this.currentQuiz.quizId) {
          // Submit to real API
          const result = await checkpointQuizService.submitQuizAnswer(
            this.userId, // Current user ID
            this.currentQuiz.quizId,
            this.selectedAnswer
          );

          if (result.isCorrect) {
            this.showSuccess("Correct!", "Well done! 🎉");
          } else {
            this.showError(
              "Incorrect",
              `The correct answer was: ${
                this.currentQuiz.options[this.currentQuiz.correctAnswer]
              }`
            );
          }
        } else {
          // Fallback to local validation
          const isCorrect =
            this.selectedAnswer === this.currentQuiz.correctAnswer;

          if (isCorrect) {
            this.showSuccess("Correct!", "Well done! 🎉");
          } else {
            this.showError(
              "Incorrect",
              `The correct answer was: ${
                this.currentQuiz.options[this.currentQuiz.correctAnswer]
              }`
            );
          }
        }
      } catch (error) {
        console.error("Failed to submit quiz:", error);
        // Fallback to local validation
        const isCorrect =
          this.selectedAnswer === this.currentQuiz.correctAnswer;

        if (isCorrect) {
          this.showSuccess("Correct!", "Well done! 🎉");
        } else {
          this.showError(
            "Incorrect",
            `The correct answer was: ${
              this.currentQuiz.options[this.currentQuiz.correctAnswer]
            }`
          );
        }
      }

      this.showQuiz = false;
      this.selectedAnswer = null;
    },

    triggerAnnotation() {
      console.log("Triggering annotation");
      this.showAnnotation = true;
    },

    onPdfLoad() {
      console.log("PDF loaded successfully");
      this.pdfError = null;
    },

    onPdfError() {
      console.log("PDF failed to load - likely access denied");
      this.pdfError = "Access denied. The PDF file is not publicly accessible.";
    },

    getPdfUrl(storageUrl, page = 1) {
      // For single page display, we'll append page parameter
      // This assumes the PDF viewer supports page parameter
      const baseUrl = storageUrl;
      if (baseUrl.includes("#")) {
        return `${baseUrl}#page=${page}&toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&scrollbar=0`;
      } else {
        return `${baseUrl}#page=${page}&toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&scrollbar=0`;
      }
    },

    retryPdfLoad() {
      this.pdfError = null;
      // Force re-render of iframe
      this.$nextTick(() => {
        // The iframe will re-render with the same src
      });
    },

    downloadPdf() {
      if (this.book.storageUrl) {
        // Create a download link
        const link = document.createElement("a");
        link.href = this.book.storageUrl;
        link.download = `${this.book.title}.pdf`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },

    retryLoad() {
      this.loadBook();
    },

    goBack() {
      this.$router.push("/library");
    },

    // Annotation event handlers
    async onAnnotationSaved(annotationData) {
      console.log("Annotation saved:", annotationData);

      // Record that annotation was triggered at current page
      if (this.sessionId) {
        try {
          await apiService.readingProgress.recordAnnotationTriggered(
            this.sessionId
          );
        } catch (error) {
          console.error("Failed to record annotation trigger:", error);
        }
      }

      // Show success message
      this.showSuccess(
        "Annotation Saved",
        "Your annotation has been saved successfully! 📝"
      );

      this.closeAnnotation();
    },

    onAnnotationSkipped() {
      console.log("Annotation skipped");

      // Still record that annotation was triggered (even if skipped)
      if (this.sessionId) {
        apiService.readingProgress
          .recordAnnotationTriggered(this.sessionId)
          .catch((error) =>
            console.error("Failed to record annotation trigger:", error)
          );
      }

      this.closeAnnotation();
    },

    onAnnotationError(errorMessage) {
      console.error("Annotation error:", errorMessage);
      this.annotationError = errorMessage;
      this.showError(
        "Annotation Error",
        `Failed to save annotation: ${errorMessage}`
      );
    },

    closeAnnotation() {
      this.showAnnotation = false;
      this.annotationError = null;
    },
  },
};
</script>

<style scoped>
.reading-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 1rem;
}

.reading-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  background: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.reading-title {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
}

.back-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s;
}

.back-btn:hover {
  background: #5a6268;
}

.reading-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1.5rem;
  height: calc(100vh - 120px);
}

.book-display {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
}

.spinner {
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

.error-icon,
.no-pdf-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.retry-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
}

.pdf-container {
  height: 100%;
  position: relative;
}

.pdf-viewer {
  width: 100%;
  height: 100%;
  border: none;
  overflow: hidden;
  pointer-events: none; /* Prevent user interaction with PDF */
}

.no-pdf {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6c757d;
}

.pdf-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
}

.pdf-error h3 {
  color: #dc3545;
  margin: 1rem 0 0.5rem 0;
}

.pdf-error p {
  color: #6c757d;
  margin-bottom: 1.5rem;
  max-width: 400px;
  line-height: 1.5;
}

.download-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 0.5rem;
  font-size: 0.9rem;
  transition: background 0.3s;
}

.download-btn:hover {
  background: #218838;
}

.reading-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.timer-section,
.progress-section,
.page-display-section,
.page-section,
.stats-section,
.annotation-history-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.timer-section h3,
.progress-section h3,
.page-display-section h3,
.page-section h3,
.stats-section h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.annotation-history-section {
  padding: 0;
  overflow: hidden;
}

.timer-display {
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
  text-align: center;
  margin-bottom: 1rem;
  font-family: "Courier New", monospace;
}

.timer-display.break-timer {
  color: #ff6b6b;
}

.break-timer-title {
  color: #ff6b6b !important;
}

.break-message {
  text-align: center;
  padding: 1rem;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 5px;
  margin-top: 1rem;
}

.break-message p {
  margin: 0;
  color: #856404;
  font-weight: 500;
}

.timer-controls {
  display: flex;
  gap: 0.5rem;
}

.timer-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.timer-btn.active {
  background: #28a745;
  color: white;
}

.timer-btn:not(.active) {
  background: #667eea;
  color: white;
}

.timer-btn.secondary {
  background: #6c757d;
  color: white;
}

.timer-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.progress-display {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 1rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.current-page-display {
  font-size: 3rem;
  font-weight: bold;
  color: #667eea;
  text-align: center;
  margin-bottom: 0.5rem;
  font-family: "Courier New", monospace;
}

.page-info {
  text-align: center;
}

.page-label {
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 500;
}

.page-controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #dee2e6;
  background: white;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #667eea;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-input {
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  text-align: center;
  font-size: 1rem;
}

.page-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f8f9fa;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  color: #6c757d;
  font-size: 0.9rem;
}

.stat-value {
  color: #2c3e50;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 768px) {
  .reading-content {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
  }

  .reading-sidebar {
    flex-direction: row;
    overflow-x: auto;
    gap: 1rem;
  }

  .timer-section,
  .progress-section,
  .page-display-section,
  .page-section,
  .stats-section,
  .annotation-history-section {
    min-width: 200px;
  }
}

/* Quiz Popup Styles */
.quiz-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.quiz-popup {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.quiz-header {
  background: #667eea;
  color: white;
  padding: 1.5rem;
  border-radius: 12px 12px 0 0;
  text-align: center;
}

.quiz-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.quiz-content {
  padding: 2rem;
}

.quiz-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
}

.quiz-loading .spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.quiz-loading p {
  color: #6c757d;
  font-size: 1.1rem;
  margin: 0;
}

.quiz-question {
  font-size: 1.1rem;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.quiz-option {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.quiz-option:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.quiz-option input[type="radio"] {
  margin-right: 1rem;
  transform: scale(1.2);
}

.quiz-option input[type="radio"]:checked + .option-text {
  font-weight: 600;
  color: #667eea;
}

.quiz-option:has(input[type="radio"]:checked) {
  border-color: #667eea;
  background: #f8f9ff;
}

.option-text {
  flex: 1;
  font-size: 1rem;
  color: #2c3e50;
}

.quiz-actions {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e9ecef;
  text-align: center;
}

.submit-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
}
</style>
