import { Configleam, ConfigleamOptions } from '../index';
import { Requester } from '../requester';

jest.mock('../requester');

describe('Configleam', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should throw error for invalid options', () => {
        const invalidOptions: ConfigleamOptions = { addrs: '' };
        expect(() => new Configleam(invalidOptions)).toThrow('Invalid options. Must contain "addrs" property to initiate Configleam client.');
    });

    it('should throw error for invalid addrs', () => {
        const invalidOptions: ConfigleamOptions = { addrs: 'invalid_address' };
        expect(() => new Configleam(invalidOptions)).toThrow('Invalid "addrs" value "invalid_address"');
    });

    it('should create Configleam instance with valid options', () => {
        const validOptions: ConfigleamOptions = { addrs: 'https://example.com' };
        const configleam = new Configleam(validOptions);
        expect(configleam).toBeInstanceOf(Configleam);
    });

    it('should fetch configuration successfully', async () => {
        const validOptions: ConfigleamOptions = { addrs: 'https://example.com' };
        const configleam = new Configleam(validOptions);

        const mockConfig = { data: true };
        const mockFetch = jest.spyOn(Requester.prototype, 'fetch').mockResolvedValue(mockConfig);

        const params = { env: 'test', groups: ['group1', 'group2'], globals: ['global1', 'global2'] };
        const config = await configleam.readConfig(params);

        expect(mockFetch).toHaveBeenCalledWith('/cfg', { env: 'test', groups: ['group1', 'group2'], globals: ['global1', 'global2'] }, undefined);
        expect(config).toEqual(mockConfig);
    });

    it('should handle error when fetching configuration', async () => {
        const validOptions: ConfigleamOptions = { addrs: 'https://example.com' };
        const configleam = new Configleam(validOptions);

        const mockError = new Error('Failed to fetch data');
        const mockFetch = jest.spyOn(Requester.prototype, 'fetch').mockRejectedValue(mockError);

        const params = { env: 'test' };
        await expect(configleam.readConfig(params)).rejects.toThrowError('Failed to fetch data');
    });
});
