import { Configleam, ConfigleamOptions } from '../client';
import { ConfigleamRequester } from '../requester';

jest.mock('../requester');

describe('Configleam', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error for invalid options', () => {
    const invalidOptions: ConfigleamOptions = { addrs: '', key: '' };
    expect(() => new Configleam(invalidOptions)).toThrow(
      '[Configleam] Invalid options. Must contain "addrs" property to initiate Configleam client',
    );
  });

  it('should throw error for invalid addrs', () => {
    const invalidOptions: ConfigleamOptions = {
      addrs: 'invalid_address',
      key: '',
    };
    expect(() => new Configleam(invalidOptions)).toThrow(
      '[Configleam] Invalid options. Must contain "key" property to initiate Configleam client',
    );
  });

  it('should create Configleam instance with valid options', () => {
    const validOptions: ConfigleamOptions = {
      addrs: 'https://example.com',
      key: 'key',
    };
    const configleam = new Configleam(validOptions);
    expect(configleam).toBeInstanceOf(Configleam);
  });

  it('should fetch configuration successfully', async () => {
    const validOptions: ConfigleamOptions = {
      addrs: 'https://example.com',
      key: 'key',
    };
    const configleam = new Configleam(validOptions);

    const mockConfig = { data: { data: true } };
    const mockFetch = jest
      .spyOn(ConfigleamRequester.prototype, 'fetchConfig')
      .mockResolvedValue(mockConfig);

    const params = {
      env: 'test',
      groups: ['group1', 'group2'],
      globals: ['global1', 'global2'],
    };
    const config = await configleam.readConfig(params);

    expect(mockFetch).toHaveBeenCalledWith({
      env: 'test',
      groups: ['group1', 'group2'],
      globals: ['global1', 'global2'],
    });
    expect(config.get('data')).toEqual(mockConfig['data']);
  });

  it('should handle error when fetching configuration', async () => {
    const validOptions: ConfigleamOptions = {
      addrs: 'https://example.com',
      key: 'key',
    };
    const configleam = new Configleam(validOptions);

    const mockError = new Error('Failed to fetch data');
    jest
      .spyOn(ConfigleamRequester.prototype, 'fetchConfig')
      .mockRejectedValue(mockError);

    const params = { env: 'test' };
    await expect(configleam.readConfig(params)).rejects.toThrow(mockError);
  });
});
