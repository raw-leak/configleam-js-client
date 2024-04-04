/**
 * Represents a logger interface for logging messages at different levels.
 * Implementations of this interface should provide methods for logging messages at various levels such as debug, info, warn, and error.
 */
export interface Logger {
  /**
   * Logs a debug message.
   * @param args - The message(s) to be logged.
   */
  debug(...args: any[]): void;

  /**
   * Logs an informational message.
   * @param args - The message(s) to be logged.
   */
  info(...args: any[]): void;

  /**
   * Logs a warning message.
   * @param args - The message(s) to be logged.
   */
  warn(...args: any[]): void;

  /**
   * Logs an error message.
   * @param args - The message(s) to be logged.
   */
  error(...args: any[]): void;
}
