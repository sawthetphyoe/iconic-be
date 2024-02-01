import * as AWS from 'aws-sdk';
import { Provider } from '@nestjs/common';

// Unique identifier of the service in the dependency injection layer
export const DoSpacesServiceLib = 'lib:do-spaces-service';

// Creation of the value that the provider will always be returning.
// An actual AWS.S3 instance
const spacesEndpoint = new AWS.Endpoint('sgp1.digitaloceanspaces.com/images');

const S3 = new AWS.S3({
  endpoint: spacesEndpoint.href,
  credentials: new AWS.Credentials({
    accessKeyId: 'DO00CYBG6L3QMWP886FL',
    secretAccessKey: 'qTj4x9M6URd+BFZqUOxrYt5WXjQHOLu8rfBYEMP293U',
  }),
});

// Custom provider
export const DoSpacesServiceProvider: Provider<AWS.S3> = {
  provide: DoSpacesServiceLib,
  useValue: S3,
};
