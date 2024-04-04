import { Logger } from './logger.js';
import { Subscriber } from './subscriber.js';
import { ConfigleamConfig } from './config.js';
import { ConfigleamRequester } from './requester.js';
import { InvalidConfigleamOptionsError } from './errors.js';

/**
 * Represents the options required to initialize the Configleam client.
 */
export interface ConfigleamOptions {
  /**
   * The address of the configuration server.
   */
  addrs: string;

  /**
   * The authentication key for accessing the configuration server.
   */
  key: string;

  /**
   * Optional timeout for HTTP requests.
   */
  timeout?: number;

  /**
   * Optional headers for HTTP requests.
   */
  headers?: Record<string, string>;
}

/**
 * Represents the parameters for reading configuration.
 */
export interface ReadConfigParam {
  /**
   * The environment for which the configuration is requested.
   */
  env: string;

  /**
   * Optional groups to filter the configuration.
   */
  groups?: string | string[];

  /**
   * Optional globals to include in the configuration.
   */
  globals?: string | string[];
}

/**
 * Represents the main Configleam class responsible for handling configuration retrieval.
 */
export class Configleam {
  private readonly logger: Logger;
  private readonly requester: ConfigleamRequester;

  /**
   * Constructs a new Configleam instance.
   *
   * @param options - Configuration options required for initializing the Configleam client.
   * @param logger - Optional logger instance. Defaults to console.
   * @throws Error if options are invalid or missing required properties.
   * @throws InvalidConfigleamOptionsError if options contain invalid addrs.
   */
  constructor(options: ConfigleamOptions, logger?: Logger) {
    if (!options.addrs) {
      throw new Error(
        '[Configleam] Invalid options. Must contain "addrs" property to initiate Configleam client',
      );
    }

    if (!options.key) {
      throw new Error(
        '[Configleam] Invalid options. Must contain "key" property to initiate Configleam client',
      );
    }

    if (!this.isValidAddrs(options.addrs)) {
      throw new InvalidConfigleamOptionsError(
        `[Configleam] Invalid options. Must have a valid "addrs", received "${options.addrs}"`,
      );
    }

    this.logger = logger || console;

    this.requester = new ConfigleamRequester(
      options.addrs,
      options.key,
      this.logger,
      options.headers,
    );
  }

  /**
   * Asynchronously reads the configuration based on the provided parameters.
   *
   * @param params - Parameters for reading the configuration.
   * @returns A promise that resolves to a ConfigleamConfig object.
   * @throws Error if there is an error fetching the configuration.
   */
  async readConfig(params: ReadConfigParam): Promise<ConfigleamConfig> {
    const { groups, globals } = params;

    const query: {
      env: string;
      groups?: string | string[];
      globals?: string | string[];
    } = { env: params.env };
    if (groups) query.groups = groups;
    if (globals) query.globals = globals;

    try {
      const rawConfig = await this.requester.fetchConfig(query);

      return new ConfigleamConfig(
        rawConfig,
        new Subscriber(query, this.requester, this.logger),
        this.logger,
      );
    } catch (error) {
      this.logger.error(
        '[Configleam] Fetching configuration. Error fetching configuration: ',
        error,
      );
      throw error;
    }
  }

  private isValidAddrs(addrs: string): boolean {
    return addrs.startsWith('http://') || addrs.startsWith('https://');
  }
}
