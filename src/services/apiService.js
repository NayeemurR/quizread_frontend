// Main API service that combines all individual services
import { userAuthService } from "./userAuthService.js";
import { libraryService } from "./libraryService.js";
import { readingProgressService } from "./readingProgressService.js";
import { checkpointQuizService } from "./checkpointQuizService.js";
import { annotateService } from "./annotateService.js";
import { focusTimerService } from "./focusTimerService.js";

export const apiService = {
  // User Authentication
  auth: userAuthService,

  // Library Management
  library: libraryService,

  // Reading Progress Tracking
  readingProgress: readingProgressService,

  // Quiz System
  quiz: checkpointQuizService,

  // Annotation System
  annotation: annotateService,

  // Focus Timer
  timer: focusTimerService,
};

export default apiService;
