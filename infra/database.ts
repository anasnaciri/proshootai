// Create the DynamoDB table
export const projectsTable = new sst.aws.Dynamo('Projects', {
  fields: {
    PK: 'string',
    SK: 'string',
    project: 'string',
  },
  primaryIndex: { hashKey: 'PK', rangeKey: 'SK' },
  globalIndexes: {
    ProjectIndex: { hashKey: 'project', rangeKey: 'SK' },
  },
});

export const propsTable = new sst.aws.Dynamo('Props', {
  fields: {
    PK: 'string',
    SK: 'string',
  },
  primaryIndex: { hashKey: 'PK', rangeKey: 'SK' },
});

export const stylesTable = new sst.aws.Dynamo('Styles', {
  fields: {
    PK: 'string',
    SK: 'string',
  },
  primaryIndex: { hashKey: 'PK', rangeKey: 'SK' },
});
