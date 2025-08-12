/**
 * Global error handler for unhandled promise rejections
 */
export const setupGlobalErrorHandlers = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // You can add custom error reporting here
  });

  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    console.error('Uncaught error:', event.error);
    // You can add custom error reporting here
  });
};

/**
 * Safe async function wrapper with error handling
 */
export const safeAsync = async <T>(
  asyncFn: () => Promise<T>,
  fallback?: T
): Promise<T> => {
  try {
    return await asyncFn();
  } catch (error) {
    console.error('Async operation failed:', error);
    if (fallback !== undefined) {
      return fallback;
    }
    throw error;
  }
};

// Initialize global error handlers
setupGlobalErrorHandlers();
