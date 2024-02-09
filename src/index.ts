import { InvalidConfigleamOptionsError } from "./errors";
import { Requester } from "./requester";

export interface ConfigleamOptions {
    addrs: string;
};

export interface ReadConfigParam {
    env: string;
    groups?: string[] | string;
    globals?: string[] | string
}

export interface ReadConfigOptions {
    headers?: Record<string, string>
}

export interface ConfigleamConfig {
    [key: string]: any;
}

export interface ConfigleamClient {
    readConfig(params: ReadConfigParam): Promise<ConfigleamConfig>;
}

export class Configleam implements ConfigleamClient {
    private readonly requester: Requester;
    private readonly version = 1;
    private readonly readConfigPath = "/cfg"

    constructor(options: ConfigleamOptions) {
        if (!options.addrs) {
            throw new Error('Invalid options. Must contain "addrs" property to initiate Configleam client.');
        }

        if (!this.isValidAddrs(options.addrs)) {
            throw new InvalidConfigleamOptionsError(`Invalid "addrs" value "${options.addrs}"`);
        }


        this.requester = new Requester(options.addrs, this.version)
    }

    private isValidAddrs(addrs: string): boolean {
        return addrs.startsWith('http://') || addrs.startsWith('https://');
    }

    async readConfig(params: ReadConfigParam, options?: ReadConfigOptions): Promise<ConfigleamConfig> {
        const { env, groups, globals } = params

        const query: ReadConfigParam = { env }
        if (groups) query.groups = groups
        if (globals) query.globals = globals

        try {
            const config = await this.requester.fetch(this.readConfigPath, query as any, options?.headers)
            return config;
        } catch (error) {
            console.error('Error fetching configuration:', error);
            throw error;
        }
    }
}



