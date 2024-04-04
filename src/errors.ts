/**
 * Represents an error that occurs when configuration options are invalid.
 * This error is thrown when the provided options for Configleam are incorrect or missing essential properties.
 */
export class InvalidConfigleamOptionsError extends Error {
  /**
   * Constructs a new InvalidConfigleamOptionsError instance.
   * @param message - A description of the error.
   */
  constructor(message: string) {
    super(message);
    this.name = 'InvalidConfigleamOptionsError';
  }
}

/**
 * Represents an error that occurs when fetching configuration fails.
 * This error is thrown when there is a failure in fetching configuration data from the server.
 */
export class ConfigFetchError extends Error {
  /**
   * Constructs a new ConfigFetchError instance.
   * @param message - A description of the error.
   */
  constructor(message: string) {
    super(message);
    this.name = 'ConfigFetchError';
  }
}
