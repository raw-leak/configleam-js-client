// Custom error class for invalid configuration options
export class InvalidConfigleamOptionsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'INVALID_CONFIG_OPTIONS_ERROR';
    }
}

// Custom error class for failed configuration fetch
export class ConfigFetchError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CONFIG_FETCH_ERROR';
    }
}