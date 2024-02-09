import { Requester } from '../requester';

describe('Requester', () => {
    let requester: Requester;

    beforeEach(() => {
        requester = new Requester('https://example.com', 1);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should fetch data successfully', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({ data: 'mocked data' }),
            statusText: 'OK',
        });

        const path = '/test';
        const query = { param1: 'value1', param2: 'value2' };
        const headers = { 'Authorization': 'Bearer token' };

        const result = await requester.fetch(path, query, headers);

        expect(fetch).toHaveBeenCalledWith(
            'https://example.com/v1/test?param1=value1&param2=value2',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer token',
                },
            }
        );
        expect(result).toEqual({ data: 'mocked data' });
    });

    it('should handle failed fetch', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            statusText: 'Error',
        });

        const path = '/test';
        const query = { param1: 'value1' };

        await expect(requester.fetch(path, query)).rejects.toThrow('Failed to fetch data: Error');
    });
});
