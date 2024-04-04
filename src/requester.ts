import * as http from 'http';
import * as https from 'https';

import { URLSearchParams } from 'url';

import { Logger } from './logger.js';

/**
 * Represents the raw configuration data obtained from the server.
 */
export type RawConfig = Record<string, any>;

/**
 * Represents a client for making HTTP requests to fetch configuration data and receive SSE events.
 */
export class ConfigleamRequester {
  private readonly ACCESS_KEY_HEADER = 'X-Access-Key';

  private readonly logger: Logger;
  private readonly baseUrl: string;
  private readonly accessKey: string;
  private readonly headers: Record<string, string> | undefined;

  private readonly readConfigPath = 'config';
  private readonly sseConfigPath = 'config/sse';

  private readonly timeout = 3000; // 3s

  /**
   * Constructs a new ConfigleamRequester instance.
   *
   * @param baseUrl - The base URL of the configuration server.
   * @param accessKey - The access key for authentication.
   * @param logger - The logger instance for logging messages.
   * @param headers - Optional additional headers for HTTP requests.
   */
  constructor(
    baseUrl: string,
    accessKey: string,
    logger: Logger,
    headers?: Record<string, string>,
  ) {
    this.baseUrl = new URL(baseUrl).toString();
    this.accessKey = accessKey;
    this.logger = logger;
    this.headers = headers;
  }

  /**
   * Fetches the raw configuration data from the server.
   *
   * @param queries - The query parameters for filtering the configuration.
   * @returns A promise that resolves to the raw configuration data.
   */
  async fetchConfig(
    queries: Record<string, string | string[]>,
  ): Promise<RawConfig> {
    const url = new URL(`${this.baseUrl}${this.readConfigPath}`);
    let queryParams = '';

    for (const key in queries) {
      const value = queries[key];

      if (Array.isArray(value)) {
        for (const queryValue of value) {
          queryParams = queryParams + `&${key}=${queryValue}`;
        }
      } else {
        queryParams = queryParams + `&${key}=${value}`;
      }
    }

    const moduleToUse = url.protocol === 'https:' ? https : http;

    const options: https.RequestOptions = {
      timeout: this.timeout,
      headers: {
        ...(this.headers || {}),
        [this.ACCESS_KEY_HEADER]: this.accessKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    const urlString = `${url.toString()}?${queryParams}`;

    return new Promise((resolve, reject) => {
      const req = moduleToUse.get(urlString, options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 400) {
            reject(
              new Error(
                `[Configleam] HTTP request. Failed to fetch data: ${res.statusCode} ${res.statusMessage}`,
              ),
            );
          } else {
            try {
              resolve(JSON.parse(data));
            } catch (error) {
              reject(error);
            }
          }
        });
      });

      req.on('error', reject);

      req.end();
    });
  }

  /**
   * Establishes a server-sent event (SSE) connection to receive configuration updates.
   *
   * @param env - Environment
   * @param connback - The callback function that indicates that the connection has been established successfully.
   * @param callback - The callback function to handle received SSE events.
   * @param errback - The callback function to handle errors during SSE connection.
   * @returns A promise that resolves when the SSE connection is established.
   */
  async subscribeToConfigEvents(
    env: string,
    connback: () => void,
    callback: (data: any) => void,
    errback: (error: Error) => void,
  ): Promise<() => void> {
    const url = new URL(`${this.baseUrl}${this.sseConfigPath}`);
    url.search = new URLSearchParams({ env }).toString();

    const moduleToUse = url.protocol === 'https:' ? https : http;

    const options: https.RequestOptions = {
      timeout: this.timeout,
      headers: {
        ...(this.headers || {}),
        [this.ACCESS_KEY_HEADER]: this.accessKey,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    };

    const req = moduleToUse.get(url, options);

    req.on('response', (res) => {
      if (res.statusCode !== 200) {
        this.logger.error(
          `[Configleam] SSE connection. Failed to establish SSE connection with status code: ${res.statusCode}`,
        );

        req.destroy();
        errback(
          new Error('[Configleam] SSE connection. SSE was not established'),
        );
        return;
      }

      // connection confirmation
      connback();

      res.setEncoding('utf-8');

      res.on('data', callback);
      res.on('error', errback);

      res.on('end', () => {
        this.logger.error('[Configleam] SSE connection. SSE connection closed');
        errback(
          new Error('[Configleam] SSE connection. Closed SSE connection'),
        );
      });
    });

    req.on('error', (error) => {
      this.logger.error(
        '[Configleam] SSE connection. Error on establishing SSE connection: ',
        error.stack,
      );
      errback(error);
    });

    return () => {
      req.destroy();
    };
  }
}
