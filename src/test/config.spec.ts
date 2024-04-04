import { Logger } from '../logger';
import { ConfigleamConfig } from '../config';
import { Subscriber } from '../subscriber';
import { ConfigleamRequester, RawConfig } from '../requester';

jest.mock('../subscriber');
jest.mock('../logger');
jest.mock('../utils');

describe('ConfigleamConfig', () => {
  let configleamConfig: ConfigleamConfig;
  let subscriber: Subscriber;
  let logger: Logger;
  let rawConfig: RawConfig;
  let requester: ConfigleamRequester;
  let params: {
    env: string;
    groups?: string | string[];
    globals?: string | string[];
  };

  beforeEach(() => {
    params = { env: 'test' };
    logger = console;
    rawConfig = { 'group-1': { data: { data: { data: 'data' } } } };

    requester = new ConfigleamRequester('https://example.com', 'key', logger);
    subscriber = new Subscriber(params, requester, logger);
    configleamConfig = new ConfigleamConfig(rawConfig, subscriber, logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize properties correctly', () => {
      // Test constructor initialization
    });
  });

  describe('get', () => {
    it('should retrieve existing configuration property correctly', () => {
      const propertyValue = configleamConfig.get('group-1.data.data.data');
      expect(propertyValue).toEqual('data');
    });

    it('should return null for non-existing configuration property', () => {
      const propertyValue = configleamConfig.get('non-existing-property');
      expect(propertyValue).toBeNull();
    });

    it('should return default value for non-existing configuration property', () => {
      const defaultValue = 'default';
      const propertyValue = configleamConfig.get(
        'non-existing-property',
        defaultValue,
      );
      expect(propertyValue).toEqual(defaultValue);
    });

    it('should return default value for nested non-existing configuration property', () => {
      const defaultValue = 'default';
      const propertyValue = configleamConfig.get('group-2.data', defaultValue);
      expect(propertyValue).toEqual(defaultValue);
    });
  });

  describe('onUpdate', () => {
    it('should subscribe to updates for a specific configuration property', async () => {
      // Test onUpdate method
    });
  });

  describe('onError', () => {
    it('should set error callback function', () => {
      // Test onError method
    });
  });

  describe('stop', () => {
    it('should stop subscription to configuration updates', () => {
      // Test stop method
    });
  });

  // Add more test cases for internal callbacks, error handling, and edge cases...
});
