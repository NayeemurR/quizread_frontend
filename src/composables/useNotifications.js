import { ref } from "vue";

// Global notification state
const notifications = ref([]);
let nextId = 1;

export function useNotifications() {
  const showNotification = (
    title,
    message,
    type = "info",
    duration = 10000
  ) => {
    const notification = {
      id: nextId++,
      title,
      message,
      type,
      duration,
    };

    notifications.value.push(notification);

    // Auto-remove after duration
    setTimeout(() => {
      removeNotification(notification.id);
    }, duration);
  };

  const removeNotification = (id) => {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };

  // Convenience methods for different notification types
  const showSuccess = (title, message, duration = 10000) => {
    showNotification(title, message, "success", duration);
  };

  const showError = (title, message, duration = 10000) => {
    showNotification(title, message, "error", duration);
  };

  const showInfo = (title, message, duration = 10000) => {
    showNotification(title, message, "info", duration);
  };

  return {
    notifications,
    showNotification,
    removeNotification,
    showSuccess,
    showError,
    showInfo,
  };
}
