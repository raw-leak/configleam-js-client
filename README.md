
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

## Quick start

```javascript
import { Configleam, ConfigleamOptions } from 'configleam-js-client';

// Create a Configleam instance
const options: ConfigleamOptions = {
  addrs: 'https://example.com/configleam',
  key: "<access-key>"
};

const configleam = new Configleam(options);

// Read configuration
const params = {
  env: 'production',
  groups: ['api-one'],
  globals: ['database', 'cache'],
};

const config = await configleam.readConfig(params);

const defaultPort = 8081;
const port = config.get("api-one.port", defaultPort)
```

## API

### Configleam(options: ConfigleamOptions)

Creates a new instance of the Configleam client with the specified options.

#### Parameters
- `options`: A configuration object for initializing the Configleam client.
  - `addrs`: The base URL of the Configleam service API.
  - `key`: The access-key to access Configleam service API.

### `readConfig(params: ReadConfigParam): Promise<ConfigleamConfig>`

Fetches configuration data from the Configleam service endpoint.

#### Parameters
- `params` (`ReadConfigParam`): An object containing parameters for fetching configuration data.
  - `env` (`string`): The environment for which configuration data is requested.
  - `groups` (`Array<string>|string`) (optional): An array of groups to filter the configuration data.
  - `globals` (`Array<string>|string`) (optional): An array of global keys to include in the configuration data.

#### Returns
- `Promise<ConfigleamConfig>`: A promise that resolves to an instance of `ConfigleamConfig`. 

#### Example Request
```typescript
const params = {
  env: 'production',
  groups: ['api-one', 'api-two'],
  globals: ['global-1', 'global-2']
};
try {
  const config = await configleam.readConfig(params);
} catch (err) {
  // handle error
}
```

### ConfigleamConfig

The `ConfigleamConfig` class encapsulates configuration data fetched from the Configleam service, providing an intuitive interface for accessing, monitoring, and interacting with this data. Instances of `ConfigleamConfig` are returned by the `readConfig` method of the `Configleam` client, equipped with methods to retrieve specific configuration properties, subscribe to their updates, handle errors, and unsubscribe from updates.


### `onUpdate(key: string, callback: UpdateCallback, errback?: UpdateErrback): Promise<ConfigleamConfig>`

Subscribes to updates for a specific configuration property. When the property's value changes, the specified callback function is invoked with the new value. An optional error callback can be provided to handle any errors that occur during subscription or update fetching.

#### Parameters

- `key` (`string`): The key representing the configuration property to subscribe to updates for. This should be a unique identifier within your configuration data structure.

- `callback` (`UpdateCallback`): A function that is called when the subscribed configuration property is updated. The function receives the new property value as its parameter.

- `errback` (`UpdateErrback`): An optional function that is called if an error occurs during the subscription process or while fetching updates. This function receives an error object as its parameter.

#### Returns
- `ConfigleamConfig`: Resolves to the `ConfigleamConfig` instance, allowing for chaining further operations or subscriptions.

#### Example Usage

```typescript
import { Configleam } from 'configleam-js-client';

// Assuming `configleam` is an already initialized instance of Configleam and config is already read

// Define the callback for configuration updates
function onDatabasePasswordUpdated(newPassword) {
  console.log('New database password is:', newPassword);
}

// Define the error callback
function onDatabasePasswordError(error) {
  console.error('Failed to subscribe to configuration updates:', error);
}

// Subscribe to updates for the 'database' configuration
config.onUpdate('api.database.password', onDatabasePasswordUpdated, onDatabasePasswordError);
```

### `onError(errback: UpdateErrback): ConfigleamConfig`

Sets a global error callback function to handle any errors that occur during the process of fetching configuration updates. This method provides a way to globally handle errors instead of specifying error callbacks for each subscription.

#### Parameters

- `errback` (`UpdateErrback`): A function that is called when an error occurs during configuration updates. The function receives an error object as its parameter. This error object typically contains details about the error that occurred, allowing for appropriate error handling or logging.

#### Returns
- `ConfigleamConfig`: Resolves to the `ConfigleamConfig` instance, allowing for chaining further operations or subscriptions.

#### Example Usage
```typescript
// Assuming `configleam` is an already initialized instance of Configleam and config is already read

// Define the global error handler
function globalUpdateErrorHandler(error) {
  console.error('A configuration update error occurred:', error);
}

// Set the global error handler
config.onError(globalUpdateErrorHandler);

// Now, any errors that occur during configuration updates will be handled by the globalUpdateErrorHandler function
```

#### Behavior in Case of Connection Loss
In scenarios where the connection to the server is lost, the `errback` function provided to `onError` will be called with an error object detailing the connectivity issue. The library implements a resilient connection strategy, attempting to reconnect every 1 second. This reconnection attempt continues indefinitely, or until the program is terminated, ensuring that the application remains up-to-date with the latest configuration data as soon as connectivity is restored.

### `stop()`

Terminates all active subscriptions for configuration property updates previously established by the `onUpdate` method. This method is essential for resource management and ensures that your application does not continue to receive updates after they are no longer needed, such as when an application component is unmounted or when shutting down an application gracefully.

#### Example Usage
```typescript
// Assuming `configleam` is an already initialized instance of Configleam and config is already read

// Subscribe to configuration updates
const onUpdateCallback = (newValue) => {
  console.log('Configuration updated:', newValue);
};
config.onUpdate('someConfigKey', onUpdateCallback);

// Later in your application, when updates are no longer needed
config.stop();

// After calling stop(), the onUpdateCallback will no longer be called for any configuration updates.
```

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
