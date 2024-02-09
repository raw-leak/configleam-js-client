
<div align="center">
  <h1> Configleam JavaScript Client </h1>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Last Tag](https://img.shields.io/github/v/tag/raw-leak/configleam-js-client?label=Last%20Tag)
![Version](https://img.shields.io/github/v/release/raw-leak/configleam-js-client)
![Contributors](https://img.shields.io/github/contributors/raw-leak/configleam-js-client)

</div>

A JavaScript client library for interacting with the Configleam service, providing an easy-to-use interface for fetching configuration data.

**Note:** If you're looking for the main Configleam project, which provides the backend service, it is located [here](https://github.com/raw-leak/configleam).

## Installation

You can install the Configleam JavaScript client via npm:

```bash
npm install configleam-js-client
```

## Usage

```javascript
import { Configleam, ConfigleamOptions } from 'configleam-js-client';

// Create a Configleam instance
const options: ConfigleamOptions = {
  addrs: 'https://example.com/configleam',
};

const configleam = new Configleam(options);

// Read configuration
const params = {
  env: 'development',
  groups: ['api-product'],
  globals: ['redis', 'mongo'],
};

const config = await configleam.readConfig(params);
console.log(config);
```

## Configuration Options

- `addrs`: The base URL of the Configleam service.

## API

### `Configleam(options: ConfigleamOptions)`

Creates a new instance of the Configleam client with the specified options.

### `readConfig(params: ReadConfigParam, options?: ReadConfigOptions): Promise<ConfigleamConfig>`

Fetches configuration data from the Configleam service endpoint.

- `params`: An object containing parameters for fetching configuration data (e.g., environment, groups, globals).
- `options` (optional): Additional options for the request, such as custom headers.

## Contributing

Contributions are welcome! Please see the [Contribution Guidelines](CONTRIBUTING.md) for more information.

## Bug Reports and Feature Requests

Please report any issues or feature requests on the [Issue Tracker](https://github.com/raw-lean/configleam-js-client/issues).

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

[LinkedIn](https://www.linkedin.com/in/mykhaylo-gusak/)
[Mykhaylo Gusak] - mykhaylogusak@hotmail.com

Project Link: [https://github.com/raw-leak/configleam-js-client](https://github.com/raw-leak/configleam-js-client)
