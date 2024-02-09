export class Requester {
    private readonly baseUrl: string;


    constructor(baseUrl: string, version: number = 1) {
        this.baseUrl = new URL(`v${version}`, baseUrl).toString()
    }

    async fetch(path: string, query: Record<string, string | string[]> = {}, headers: Record<string, string> = {}): Promise<any> {
        const url = new URL(`${this.baseUrl}${path}`);
        url.search = new URLSearchParams(query as any).toString()

        try {
            const response = await fetch(url.toString(), {
                headers: {
                    ...headers,
                    'Content-Type': 'application/json',
                    "Accept": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.statusText}`);
            }

            return response.json();
        } catch (error) {
            throw error;
        }
    }
}
