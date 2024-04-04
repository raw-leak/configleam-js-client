import * as http from 'http';
import * as https from 'https';

import { ConfigleamRequester } from '../requester';

jest.mock('http');
jest.mock('https');

describe('ConfigleamRequester', () => {
  describe('https module', () => {
    let requester: ConfigleamRequester;

    beforeEach(() => {
      requester = new ConfigleamRequester(
        'https://example.com',
        'key',
        console,
      );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should handle successful request', async () => {
      const mockResponseData = { data: 'mocked data' };
      const mockHttpsModule = {
        get: jest
          .fn()
          .mockImplementation(
            (url: string, options: any, callback: (response: any) => void) => {
              const mockResponse = {
                statusCode: 200,
                on: (
                  eventName: string,
                  eventHandler: (data?: string) => void,
                ) => {
                  if (eventName === 'data') {
                    eventHandler(JSON.stringify(mockResponseData));
                  } else if (eventName === 'end') {
                    eventHandler();
                  }
                },
              };
              callback(mockResponse);
              return { end: jest.fn() };
            },
          ),
      };

      jest.spyOn(https, 'get').mockImplementation(mockHttpsModule.get);

      const query = { param1: 'value1', param2: 'value2' };
      const result = await requester.fetchConfig(query);

      expect(https.get).toHaveBeenCalled();
      expect(result).toEqual(mockResponseData);
    });

    it('should handle error response', async () => {
      const mockErrorResponse = {
        statusCode: 404,
        statusMessage: 'Not Found',
      };
      const mockHttpsModule = {
        get: jest
          .fn()
          .mockImplementation(
            (url: string, options: any, callback: (response: any) => void) => {
              const mockResponse = {
                statusCode: mockErrorResponse.statusCode,
                statusMessage: mockErrorResponse.statusMessage,
                on: (eventName: string, eventHandler: () => void) => {
                  if (eventName === 'end') {
                    eventHandler();
                  }
                },
              };
              callback(mockResponse);
              return { end: jest.fn() };
            },
          ),
      };

      jest.spyOn(https, 'get').mockImplementation(mockHttpsModule.get);

      const query = { param1: 'value1', param2: 'value2' };

      await expect(requester.fetchConfig(query)).rejects.toThrowError(
        `[Configleam] HTTP request. Failed to fetch data: ${mockErrorResponse.statusCode} ${mockErrorResponse.statusMessage}`,
      );
    });
  });
  describe('http module', () => {
    let requester: ConfigleamRequester;

    beforeEach(() => {
      requester = new ConfigleamRequester('http://example.com', 'key', console);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should handle successful request', async () => {
      const mockResponseData = { data: 'mocked data' };
      const mockHttpModule = {
        get: jest
          .fn()
          .mockImplementation(
            (url: string, options: any, callback: (response: any) => void) => {
              const mockResponse = {
                statusCode: 200,
                on: (
                  eventName: string,
                  eventHandler: (data?: string) => void,
                ) => {
                  if (eventName === 'data') {
                    eventHandler(JSON.stringify(mockResponseData));
                  } else if (eventName === 'end') {
                    eventHandler();
                  }
                },
              };
              callback(mockResponse);
              return { end: jest.fn() };
            },
          ),
      };

      jest.spyOn(http, 'get').mockImplementation(mockHttpModule.get);

      const query = { param1: 'value1', param2: 'value2' };
      const result = await requester.fetchConfig(query);

      expect(http.get).toHaveBeenCalled();
      expect(result).toEqual(mockResponseData);
    });

    it('should handle error response', async () => {
      const mockErrorResponse = {
        statusCode: 404,
        statusMessage: 'Not Found',
      };
      const mockHttpModule = {
        get: jest
          .fn()
          .mockImplementation(
            (url: string, options: any, callback: (response: any) => void) => {
              const mockResponse = {
                statusCode: mockErrorResponse.statusCode,
                statusMessage: mockErrorResponse.statusMessage,
                on: (eventName: string, eventHandler: () => void) => {
                  if (eventName === 'end') {
                    eventHandler();
                  }
                },
              };
              callback(mockResponse);
              return { end: jest.fn() };
            },
          ),
      };

      jest.spyOn(http, 'get').mockImplementation(mockHttpModule.get);

      const query = { param1: 'value1', param2: 'value2' };

      await expect(requester.fetchConfig(query)).rejects.toThrowError(
        `[Configleam] HTTP request. Failed to fetch data: ${mockErrorResponse.statusCode} ${mockErrorResponse.statusMessage}`,
      );
    });
  });
});
