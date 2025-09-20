import {
  DynamoDBClient,
  QueryCommandInput,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Resource } from 'sst';
import { z } from 'zod';
import { fn } from '../util/fn';

export module Style {
  export const Info = z.object({
    id: z.string(),
    image: z.string(),
    category: z.string(),
    tags: z.string().array(),
  });

  export type Info = z.infer<typeof Info>;

  const client = new DynamoDBClient();
  const s3Client = new S3Client();

  export const listCategories = async () => {
    const input: QueryCommandInput = {
      TableName: Resource.Props.name,
      KeyConditionExpression: '#PK = :pk',
      ExpressionAttributeNames: {
        '#PK': 'PK',
      },
      ExpressionAttributeValues: marshall({
        ':pk': `CATEGORYCOLLECTION`,
      }),
    };

    const command = new QueryCommand(input);
    const response = await client.send(command);

    const items = response.Items?.map((item) => unmarshall(item));
    return items;
  };

  export const listCategory = fn(z.string(), async (categoryId) => {
    const input: QueryCommandInput = {
      TableName: Resource.Props.name,
      KeyConditionExpression: '#PK = :pk AND begins_with(#SK , :sk)',
      ExpressionAttributeNames: {
        '#PK': 'PK',
        '#SK': 'SK',
      },
      ExpressionAttributeValues: marshall({
        ':pk': `CATEGORY#${categoryId}`,
        ':sk': 'STYLE#',
      }),
    };

    const command = new QueryCommand(input);
    const response = await client.send(command);

    const items = response.Items?.map((item) => unmarshall(item));
    return items;
  });
}
