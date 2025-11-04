// Use environment variable if provided, otherwise default to backend URL for production
// In development, you can set VITE_API_BASE_URL="" to use relative URLs with Vite proxy
// const API_BASE =
//   import.meta.env.VITE_API_BASE_URL !== undefined
//     ? import.meta.env.VITE_API_BASE_URL
//     : "https://quizread-backend.onrender.com";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

// API Configuration
export const API_CONFIG = {
  BASE_URL: API_BASE, // Use environment variable or default to backend URL
  ENDPOINTS: {
    // Annotate endpoints
    ANNOTATE: {
      SAVE_ANNOTATION: "/api/Annotate/saveAnnotation",
      GET_USER_ANNOTATIONS: "/api/Annotate/_getUserAnnotations",
      GET_ALL_USER_ANNOTATIONS: "/api/Annotate/_getAllUserAnnotations",
      GET_ANNOTATIONS_FOR_BOOK: "/api/Annotate/_getAnnotationsForBook",
    },
    // CheckpointQuiz endpoints
    CHECKPOINT_QUIZ: {
      CREATE_QUIZ: "/api/CheckpointQuiz/createQuiz",
      CREATE_QUIZ_FROM_PDF: "/api/CheckpointQuiz/createQuizFromPDF",
      GET_QUIZ_CONTEXT: "/api/CheckpointQuiz/getQuizContext",
      SUBMIT_QUIZ_ANSWER: "/api/CheckpointQuiz/submitQuizAnswer",
      GET_QUIZ: "/api/CheckpointQuiz/_getQuiz",
      GET_QUIZ_ATTEMPTS: "/api/CheckpointQuiz/_getQuizAttempts",
      GET_USER_ATTEMPTS: "/api/CheckpointQuiz/_getUserAttempts",
    },
    // FocusTimer endpoints
    FOCUS_TIMER: {
      START: "/api/FocusTimer/start",
      PAUSE: "/api/FocusTimer/pause",
      RESUME: "/api/FocusTimer/resume",
      EXPIRE: "/api/FocusTimer/expire",
      GET_TIMER: "/api/FocusTimer/_getTimer",
      GET_ACTIVE_TIMERS: "/api/FocusTimer/_getActiveTimers",
      GET_TIMERS_BY_PHASE: "/api/FocusTimer/_getTimersByPhase",
    },
    // Library endpoints
    LIBRARY: {
      PREPARE_UPLOAD: "/api/Library/prepareUpload",
      ADD_BOOK: "/api/Library/addBook",
      GET_BOOK: "/api/Library/getBook",
      LIST_BOOKS: "/api/Library/listBooks",
      REMOVE_BOOK: "/api/Library/removeBook",
      GET_BOOK_DETAILS: "/api/Library/_getBook",
      GET_USER_BOOKS: "/api/Library/_getUserBooks",
      GET_ALL_BOOKS: "/api/Library/_getAllBooks",
    },
    // ReadingProgress endpoints
    READING_PROGRESS: {
      INITIALIZE_PROGRESS: "/api/ReadingProgress/initializeProgress",
      UPDATE_PROGRESS: "/api/ReadingProgress/updateProgress",
      TRIGGER_QUIZ: "/api/ReadingProgress/triggerQuiz",
      TRIGGER_ANNOTATION: "/api/ReadingProgress/triggerAnnotation",
      RECORD_QUIZ_TRIGGERED: "/api/ReadingProgress/recordQuizTriggered",
      RECORD_ANNOTATION_TRIGGERED:
        "/api/ReadingProgress/recordAnnotationTriggered",
      PAUSE_READING: "/api/ReadingProgress/pauseReading",
      RESUME_READING: "/api/ReadingProgress/resumeReading",
      GET_READING_SESSION: "/api/ReadingProgress/_getReadingSession",
      GET_USER_SESSIONS: "/api/ReadingProgress/_getUserSessions",
      GET_BOOK_SESSIONS: "/api/ReadingProgress/_getBookSessions",
      GET_ACTIVE_SESSIONS: "/api/ReadingProgress/_getActiveSessions",
    },
    // UserAuthentication endpoints
    USER_AUTH: {
      REGISTER: "/api/UserAuth/register",
      LOGIN: "/api/UserAuth/login",
      GET_USER: "/api/UserAuth/_getUser",
      GET_USER_BY_EMAIL: "/api/UserAuth/_getUserByEmail",
      GET_ALL_USERS: "/api/UserAuth/_getAllUsers",
    },
  },
};
