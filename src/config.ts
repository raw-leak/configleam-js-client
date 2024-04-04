import { Logger } from './logger.js';
import { RawConfig } from './requester.js';
import { Subscriber } from './subscriber.js';
import { hasValueChanged } from './utils.js';

/**
 * Represents a callback function that receives updated configuration data.
 */
export type UpdateCallback = (data: any) => void;

/**
 * Represents a callback function that handles errors during configuration updates.
 */
export type UpdateErrback = (error: Error) => void;

/**
 * Represents a subscription to configuration updates.
 */
type Subscription = {
  /**
   * The current value of the subscription.
   */
  value: any;

  /**
   * The callback function to be invoked when the configuration updates.
   */
  callback: UpdateCallback;

  /**
   * Optional callback function to handle errors during configuration updates.
   */
  errback?: UpdateErrback;
};

/**
 * Represents a configuration object obtained from the Configleam service.
 * Provides methods for accessing and subscribing to configuration updates.
 */
export class ConfigleamConfig {
  private rawConfig: RawConfig;
  private errback: UpdateErrback | undefined;

  private readonly logger: Logger;
  private readonly subscriber: Subscriber;

  private readonly subscriptions: Record<string, Subscription> = {};
  private subscribed = false;

  /**
   * Constructs a new ConfigleamConfig instance.
   *
   * @param rawConfig - The raw configuration data.
   * @param subscriber - The subscriber instance for receiving configuration updates.
   * @param logger - The logger instance for logging messages.
   */
  constructor(rawConfig: RawConfig, subscriber: Subscriber, logger: Logger) {
    this.rawConfig = rawConfig;
    this.subscriber = subscriber;
    this.logger = logger;
  }

  /**
   * Retrieves the value of a configuration property.
   *
   * @param key - The key representing the configuration property.
   * @param defaultValue - Optional default value to return if the property is not found.
   * @returns The value of the configuration property or the default value if provided.
   */
  get<T = any>(key: string, defaultValue?: T): null | T {
    if (!this.rawConfig) {
      return defaultValue == undefined ? null : defaultValue;
    }

    const keys = key.split('.');
    let current = this.rawConfig;

    for (const k of keys) {
      if (!(k in current)) {
        return defaultValue == undefined ? null : defaultValue;
      }

      current = current[k];
    }

    return current as T;
  }

  /**
   * Subscribes to updates for a specific configuration property.
   *
   * @param key - The key representing the configuration property to subscribe to.
   * @param callback - The callback function to be invoked when the property updates.
   * @param errback - Optional callback function to handle errors during updates.
   * @returns A promise that resolves to the ConfigleamConfig instance.
   */
  async onUpdate(
    key: string,
    callback: UpdateCallback,
    errback?: UpdateErrback,
  ): Promise<ConfigleamConfig> {
    this.subscriptions[key] = { callback, errback, value: this.get(key) };
    if (!this.subscribed) {
      await this.subscriber.subscribe(this.updateCallback, this.updateErrback);
      this.subscribed = true;
    }
    return this;
  }

  /**
   * Sets an error callback function to handle errors during configuration updates.
   *
   * @param errback - The callback function to handle errors.
   * @returns The ConfigleamConfig instance.
   */
  onError(errback: UpdateErrback): ConfigleamConfig {
    this.errback = errback;
    return this;
  }

  /**
   * Stops subscription to configuration updates.
   */
  stop() {
    if (this.subscribed) {
      this.subscriber.unsubscribe();
      this.subscribed = false;
    }
  }

  /**
   * Internal callback function for handling configuration updates.
   *
   * @param newRawConfig - The updated raw configuration data.
   */
  private updateCallback = async (newRawConfig: RawConfig): Promise<void> => {
    this.rawConfig = newRawConfig;

    try {
      Object.keys(this.subscriptions).forEach((key) => {
        const sub = this.subscriptions[key];
        const newValue = this.get(key);

        if (hasValueChanged(sub.value, newValue)) {
          try {
            sub.callback(newValue);
          } catch (err) {
            if (sub.errback) {
              sub.errback(newValue);
            }
          }
        }
      });
    } catch (err) {
      this.updateErrback(err as Error);
    }
  };

  /**
   * Internal callback function for handling errors during configuration updates.
   *
   * @param error - The error that occurred during configuration updates.
   */
  private updateErrback = async (error: Error): Promise<void> => {
    this.logger.debug(
      '[Configleam] Error on SSE connection, will attempt to reconnect: ',
      error.stack,
    );

    if (this.errback) {
      this.errback(error);
    } else {
      this.logger.error(
        '[Configleam] Error on SSE connection, will attempt to reconnect: ',
        error.stack,
      );
    }
  };
}
