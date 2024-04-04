import { sleep } from './utils.js';
import { Logger } from './logger.js';
import { RawConfig, ConfigleamRequester } from './requester.js';

/**
 * Represents a callback function that receives updated configuration data from server-sent events (SSE).
 */
type SubscribeCallback = (newRawConfig: RawConfig) => void;

/**
 * Represents a callback function that handles errors during server-sent events (SSE) subscription.
 */
type SubscribeErrback = (error: Error) => void;

/**
 * Represents a Subscriber responsible for subscribing to server-sent events (SSE) for configuration updates.
 */
export class Subscriber {
  private readonly requester: ConfigleamRequester;
  private readonly logger: Logger;

  private readonly params: {
    env: string;
    groups?: string | string[];
    globals?: string | string[];
  };
  private readonly timeout = 1000; // 1s
  private subscribed = false;

  private callback: SubscribeCallback | undefined;
  private errback: SubscribeErrback | undefined;

  private closeConnection?: () => void; // Store the close connection function

  /**
   * Constructs a new Subscriber instance.
   *
   * @param params - The parameters for reading the configuration.
   * @param requester - The requester instance for making HTTP requests.
   * @param logger - The logger instance for logging messages.
   */
  constructor(
    params: {
      env: string;
      groups?: string | string[];
      globals?: string | string[];
    },
    requester: ConfigleamRequester,
    logger: Logger,
  ) {
    this.params = params;
    this.requester = requester;
    this.logger = logger;
  }

  /**
   * Subscribes to server-sent events (SSE) for receiving configuration updates.
   *
   * @param callback - The callback function to handle received configuration updates.
   * @param errback - The callback function to handle errors during SSE subscription.
   * @returns A promise that resolves when the SSE subscription is established.
   */
  async subscribe(
    callback: SubscribeCallback,
    errback: SubscribeErrback,
  ): Promise<void> {
    if (!this.subscribed) {
      this.callback = callback;
      this.errback = errback;

      this.subscribed = true;
      await this.attemptConnection(true);
    }
  }

  /**
   * Attempts to establish a connection for receiving server-sent events (SSE).
   * @private
   */
  private async attemptConnection(firstAttempt = false): Promise<void> {
    if (!this.subscribed || !this.callback || !this.errback) {
      return;
    }

    try {
      this.logger.debug(
        '[Configleam] SSE connection. Attempting to subscribe to SSE',
      );

      // store the close connection function returned by subscribeToConfigEvents
      this.closeConnection = await this.requester.subscribeToConfigEvents(
        this.params.env,
        () => {
          // connected callback
          this.logger.debug(
            '[Configleam] SSE connection. SSE has been successfully connected',
          );

          if (!firstAttempt) {
            // trigger the callback to simulate an event after a reconnection,
            // ensuring event handling remains consistent
            this.subscribeCallback();
          }
        },
        this.subscribeCallback,
        async (error) => {
          this.logger.debug(
            '[Configleam] SSE connection. SSE connection error: ',
            error.stack,
          );

          if (this.errback) {
            this.errback(error as Error);
          }

          await sleep(this.timeout);
          this.attemptConnection();
        },
      );
    } catch (error) {
      this.logger.debug(
        '[Configleam] SSE connection. Error on establishing SSE connection: ',
        error,
      );
      this.errback(error as Error);
      await sleep(this.timeout);
      this.attemptConnection();
    }
  }

  /**
   * Callback function for handling received server-sent events (SSE).
   * @private
   */
  private subscribeCallback = async (): Promise<void> => {
    this.logger.debug('[Configleam] SSE connection. Received SSE');
    if (this.callback) {
      const rawConfig = await this.requester.fetchConfig(this.params);
      this.callback(rawConfig);
    }
  };

  /**
   * Unsubscribes from server-sent events (SSE).
   */
  unsubscribe() {
    if (this.closeConnection) {
      this.closeConnection();
    }

    this.subscribed = false;
    this.logger.debug('[Configleam] SSE connection. Unsubscribed from SSE');
  }
}
