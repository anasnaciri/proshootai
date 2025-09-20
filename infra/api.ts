import { bucket } from './storage';
import { projectsTable, propsTable, stylesTable } from './database';
import { userPool, poolClient } from './auth';
import { imageProcessingWorker } from './worker';

// const apiHandler = new sst.aws.Function('ProshootaiApiHandler', {
//   handler: 'packages/functions/src/api/index.handler',
//   timeout: '15 minutes',
//   memory: '1024 MB',
// });

export const api = new sst.aws.ApiGatewayV2('proshootApi');

const authorizer = api.addAuthorizer({
  name: 'ProshootCognitoAuthorizer',
  jwt: {
    issuer: $interpolate`https://cognito-idp.${aws.getRegionOutput().name}.amazonaws.com/${userPool.id}`,
    audiences: [poolClient.id],
  },
});

api.route(
  'ANY /',
  {
    link: [
      bucket,
      projectsTable,
      propsTable,
      stylesTable,
      imageProcessingWorker,
    ],
    handler: 'packages/functions/src/api/index.handler',
    nodejs: {
      install: ['sharp'],
    },
    timeout: '900 seconds',
  },
  {
    auth: {
      jwt: {
        authorizer: authorizer.id,
      },
    },
  },
);

api.route(
  'ANY /{proxy+}',
  {
    link: [
      bucket,
      projectsTable,
      propsTable,
      stylesTable,
      imageProcessingWorker,
    ],
    handler: 'packages/functions/src/api/index.handler',
    nodejs: {
      install: ['sharp'],
    },
    timeout: '900 seconds',
  },
  {
    auth: {
      jwt: {
        authorizer: authorizer.id,
      },
    },
  },
);

api.route('OPTIONS /', {
  link: [bucket, projectsTable, propsTable, stylesTable, imageProcessingWorker],
  handler: 'packages/functions/src/api/index.handler',
});

api.route('OPTIONS /{proxy+}', {
  link: [bucket, projectsTable, propsTable, stylesTable, imageProcessingWorker],
  handler: 'packages/functions/src/api/index.handler',
});
