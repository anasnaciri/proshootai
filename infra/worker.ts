import { bucket } from './storage';
import { projectsTable, propsTable, stylesTable } from './database';

export const imageProcessingWorker = new sst.aws.Function(
  'imageProcessingWorker',
  {
    handler: 'packages/functions/src/imageProcessingWorker.handler',
    link: [bucket, projectsTable, propsTable, stylesTable],
    timeout: '900 seconds',
  },
);
