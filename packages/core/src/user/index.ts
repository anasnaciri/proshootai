import { z } from 'zod';
import { Resource } from 'sst';
import {
  DynamoDBClient,
  QueryCommand,
  QueryCommandInput,
  GetItemCommand,
  GetItemCommandInput,
  PutItemCommand,
  PutItemInput,
  UpdateItemCommand,
  UpdateItemCommandInput,
  DeleteItemCommand,
  DeleteItemCommandInput,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { fn } from '../util/fn';
import { createID } from '../util/id';

export module User {
  export const Info = z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    created_at: z.number(),
    stripeCustomerId: z.string(),
  });

  export type Info = z.infer<typeof Info>;

  const client = new DynamoDBClient();

  export const list = async () => {
    const input: QueryCommandInput = {
      TableName: Resource.Projects.name,
      KeyConditionExpression: '#PK = :pk AND begins_with(#SK , :sk)',
      ExpressionAttributeNames: {
        '#PK': 'PK',
        '#SK': 'SK',
      },
      ExpressionAttributeValues: marshall({
        ':pk': 'USER',
        ':sk': 'USER#',
      }),
    };

    const command = new QueryCommand(input);
    const response = await client.send(command);

    const items = response.Items?.map((item) => unmarshall(item));
    return items;
  };

  export const fromId = fn(z.string(), async (userId) => {
    const input: GetItemCommandInput = {
      TableName: Resource.Projects.name,
      Key: marshall({
        PK: 'USER',
        SK: userId,
      }),
    };

    const command = new GetItemCommand(input);
    const response = await client.send(command);

    if (!response.Item) {
      throw new Error('User not found');
    }

    return unmarshall(response.Item);
  });

  export const update = fn(
    Info.pick({ id: true, name: true, stripeCustomerId: true }).partial({
      name: true,
      stripeCustomerId: true,
    }),
    async (user) => {
      const updateExpressions: string[] = [];
      const expressionAttributeValues: Record<string, any> = {};
      const expressionAttributeNames: Record<string, string> = {};

      if (user.name !== null) {
        updateExpressions.push('#name = :name');
        expressionAttributeValues[':name'] = user.name;
        expressionAttributeNames['#name'] = 'name';
      }

      if (user.stripeCustomerId !== null) {
        updateExpressions.push('#stripeCustomerId = :stripeCustomerId');
        expressionAttributeValues[':stripeCustomerId'] = user.stripeCustomerId;
        expressionAttributeNames['#stripeCustomerId'] = 'stripeCustomerId';
      }

      if (updateExpressions.length === 0) {
        return null; // No fields to update
      }

      const input: UpdateItemCommandInput = {
        TableName: Resource.Projects.name,
        Key: marshall({
          PK: 'USER',
          SK: user.id,
        }),
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeValues: marshall(expressionAttributeValues),
        ExpressionAttributeNames: expressionAttributeNames,
      };

      const command = new UpdateItemCommand(input);
      const response = await client.send(command);

      return response;
    },
  );

  export const create = fn(
    Info.omit({ id: true, stripeCustomerId: true }),
    async (user) => {
      const input: PutItemInput = {
        TableName: Resource.Projects.name,
        Item: marshall({
          PK: 'USER',
          SK: createID('user'),
          name: user.name,
          email: user.email,
          created_at: new Date().toISOString(),
        }),
      };

      const command = new PutItemCommand(input);
      const response = await client.send(command);

      return response;
    },
  );

  //should implement cascade delete later, delete all created Entites (projects, products, s3 images, videos, models etc...)
  //use execute statement command with partiql sql like language for dynamodb
  export const remove = fn(z.object({ userId: z.string() }), async (user) => {
    const projectsTableInput: DeleteItemCommandInput = {
      TableName: Resource.Projects.name,
      Key: marshall({
        PK: `USER#${user.userId}`,
      }),
    };

    const command = new DeleteItemCommand(projectsTableInput);
    const response = await client.send(command);

    return response;
  });
}
