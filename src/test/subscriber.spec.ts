import { Subscriber } from '../subscriber';
import { ConfigleamRequester, RawConfig } from '../requester';
import { Logger } from '../logger';

jest.mock('../requester');
jest.mock('../logger');
jest.mock('../utils');

describe('Subscriber', () => {
  let subscriber: Subscriber;
  let configleamRequester: ConfigleamRequester;
  let logger: Logger;
  let params: {
    env: string;
    groups: string | string[];
    globals: string | string[];
  };

  beforeEach(() => {
    logger = console;
    params = { env: 'test', groups: ['group-a'], globals: ['globals-a'] };

    configleamRequester = new ConfigleamRequester(
      'https://example.com',
      'key',
      logger,
    );
    subscriber = new Subscriber(params, configleamRequester, logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize properties correctly', () => {
      expect(subscriber['params']).toEqual(params);
      expect(subscriber['requester']).toBe(configleamRequester);
      expect(subscriber['logger']).toBe(logger);
      expect(subscriber['timeout']).toBe(1000);
      expect(subscriber['subscribed']).toBe(false);
    });
  });

  describe('subscribe', () => {
    it('should subscribe successfully when not already subscribed', async () => {
      const callback = jest.fn();
      const errback = jest.fn();

      const rawConfig: RawConfig = { newDate: 'data' };

      jest
        .spyOn(configleamRequester, 'fetchConfig')
        .mockResolvedValue(rawConfig);
      jest
        .spyOn(configleamRequester, 'subscribeToConfigEvents')
        .mockImplementationOnce(async (env, _connback, _callback, _errback) => {
          _connback();
          _callback(env);
          return () => {};
        });

      await subscriber.subscribe(callback, errback);

      expect(configleamRequester.subscribeToConfigEvents).toHaveBeenCalled();
      expect(configleamRequester.fetchConfig).toHaveBeenCalledWith(params);

      expect(subscriber['subscribed']).toBe(true);
      expect(subscriber['callback']).toBe(callback);
      expect(subscriber['errback']).toBe(errback);

      expect(callback).toHaveBeenCalledWith(rawConfig);
      expect(errback).not.toHaveBeenCalled();
    });

    it('should not subscribe when already subscribed', async () => {
      subscriber['subscribed'] = true;
      const callback = jest.fn();
      const errback = jest.fn();
      subscriber['attemptConnection'] = jest.fn();

      await subscriber.subscribe(callback, errback);

      expect(subscriber['subscribed']).toBe(true);
      expect(subscriber['callback']).toBeUndefined();
      expect(subscriber['errback']).toBeUndefined();
    });

    it('should subscribe trigger errback', async () => {
      const callback = jest.fn();
      const errback = jest.fn();

      const rawConfig: RawConfig = { newDate: 'data' };
      const errMock = new Error('test error');

      jest
        .spyOn(configleamRequester, 'fetchConfig')
        .mockResolvedValue(rawConfig);
      jest
        .spyOn(configleamRequester, 'subscribeToConfigEvents')
        .mockImplementationOnce(async (env, _connback, _callback, _errback) => {
          _errback(errMock);
          return () => {};
        });

      await subscriber.subscribe(callback, errback);

      expect(configleamRequester.subscribeToConfigEvents).toHaveBeenCalled();
      expect(configleamRequester.fetchConfig).not.toHaveBeenCalled();

      expect(subscriber['subscribed']).toBe(true);
      expect(subscriber['callback']).toBe(callback);
      expect(subscriber['errback']).toBe(errback);

      expect(callback).not.toHaveBeenCalled();
      expect(errback).toHaveBeenCalledWith(errMock);
    });
  });
});
