import { z } from 'zod';
import { Resource } from 'sst';
import { fn } from '../util/fn';
import {
  QueryCommandInput,
  QueryCommand,
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';

export module Element {
  export const Info = z.object({
    id: z.string(),
    image: z.string().nullable(),
    category: z.string(),
    tags: z.string().array(),
  });

  export type Info = z.infer<typeof Info>;

  const client = new DynamoDBClient();
  const s3Client = new S3Client();

  export const list = fn(z.string(), async (userId) => {
    const input: QueryCommandInput = {
      TableName: Resource.Props.name,
      KeyConditionExpression: '#PK = :pk AND begins_with(#SK , :sk)',
      ExpressionAttributeNames: {
        '#PK': 'PK',
        '#SK': 'SK',
      },
      ExpressionAttributeValues: marshall({
        ':pk': `USER#${userId}`,
        ':sk': 'PRD#',
      }),
    };

    const command = new QueryCommand(input);
    const response = await client.send(command);

    const items = response.Items?.map((item) => unmarshall(item));
    return items;
  });
}
