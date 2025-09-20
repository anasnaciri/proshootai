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
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export module DesignStudioProject {
  export const Info = z.object({
    id: z.string(),
    user: z.string(),
    title: z.string(),
    canvas: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
    preview: z.string(),
  });

  export type Info = z.infer<typeof Info>;

  const client = new DynamoDBClient();
  const s3Client = new S3Client();

  export const list = fn(z.string(), async (userId) => {
    const input: QueryCommandInput = {
      TableName: Resource.Projects.name,
      KeyConditionExpression: '#PK = :pk AND begins_with(#SK , :sk)',
      ExpressionAttributeNames: {
        '#PK': 'PK',
        '#SK': 'SK',
      },
      ExpressionAttributeValues: marshall({
        ':pk': `USER#${userId}`,
        ':sk': 'PRJCTDS#',
      }),
    };

    const command = new QueryCommand(input);
    const response = await client.send(command);

    const items = response.Items?.map((item) => unmarshall(item));
    return items;
  });

  export const listRecent = fn(z.string(), async (userId) => {
    const input: QueryCommandInput = {
      TableName: Resource.Projects.name,
      KeyConditionExpression: '#PK = :pk AND begins_with(#SK , :sk)',
      ExpressionAttributeNames: {
        '#PK': 'PK',
        '#SK': 'SK',
      },
      ExpressionAttributeValues: marshall({
        ':pk': `USER#${userId}`,
        ':sk': 'PRJCT',
      }),
      Limit: 5,
      ScanIndexForward: false, // This will return items in descending order (newest first)
    };

    const command = new QueryCommand(input);
    const response = await client.send(command);

    const items = response.Items?.map((item) => unmarshall(item));
    return items;
  });

  export const fromId = fn(
    z.object({ userId: z.string(), projectId: z.string() }),
    async (designStudioProject) => {
      const input: GetItemCommandInput = {
        TableName: Resource.Projects.name,
        Key: marshall({
          PK: `USER#${designStudioProject.userId}`,
          SK: `PRJCTDS#${designStudioProject.projectId}`,
        }),
      };

      const command = new GetItemCommand(input);
      const response = await client.send(command);

      if (!response.Item) {
        throw new Error('designStudioProject not found');
      }

      return unmarshall(response.Item);
    },
  );

  export const update = fn(
    Info.pick({
      user: true,
      id: true,
      title: true,
      canvas: true,
      preview: true,
    }).partial({
      title: true,
      canvas: true,
      preview: true,
    }),
    async (designStudioProject) => {
      const updateExpressions: string[] = [];
      const expressionAttributeValues: Record<string, any> = {};
      const expressionAttributeNames: Record<string, string> = {};

      if (designStudioProject.title) {
        updateExpressions.push('#title = :title');
        expressionAttributeValues[':title'] = designStudioProject.title;
        expressionAttributeNames['#title'] = 'title';
      }

      if (designStudioProject.canvas) {
        updateExpressions.push('#canvas = :canvas');
        expressionAttributeValues[':canvas'] = designStudioProject.canvas;
        expressionAttributeNames['#canvas'] = 'canvas';
      }

      if (designStudioProject.preview) {
        updateExpressions.push('#preview = :preview');
        expressionAttributeValues[':preview'] = designStudioProject.preview;
        expressionAttributeNames['#preview'] = 'preview';
      }

      if (updateExpressions.length === 0) {
        return null;
      }
      updateExpressions.push('#updated_at = :updated_at');
      expressionAttributeValues[':updated_at'] = new Date().toISOString();
      expressionAttributeNames['#updated_at'] = 'updated_at';

      const input: UpdateItemCommandInput = {
        TableName: Resource.Projects.name,
        Key: marshall({
          PK: `USER#${designStudioProject.user}`,
          SK: `PRJCTDS#${designStudioProject.id}`,
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
    Info.pick({ user: true, title: true }),
    async (designStudioProject) => {
      const item = {
        PK: `USER#${designStudioProject.user}`,
        SK: createID('dsProject'),
        title: designStudioProject.title,
        created_at: new Date().toISOString(),
        canvas: null,
        preview: null,
      };

      const input: PutItemInput = {
        TableName: Resource.Projects.name,
        Item: marshall(item),
      };

      const command = new PutItemCommand(input);
      await client.send(command);

      return item;
    },
  );

  export const remove = fn(
    z.object({ userId: z.string(), projectId: z.string() }),
    async (designStudioProject) => {
      const input: DeleteItemCommandInput = {
        TableName: Resource.Projects.name,
        Key: marshall({
          PK: `USER#${designStudioProject.userId}`,
          SK: `PRJCTDS#${designStudioProject.projectId}`,
        }),
      };

      const command = new DeleteItemCommand(input);
      const response = await client.send(command);

      return response;
    },
  );

  export const uploadToS3 = fn(
    Info.pick({ user: true, id: true }).extend({
      preview: z.instanceof(Buffer),
    }),
    async (designProject) => {
      const Key = `/${designProject.user}/projects/design/${designProject.id}.webp`;
      const command = new PutObjectCommand({
        Bucket: Resource.Uploads.name,
        Key,
        Body: designProject.preview,
        ContentType: 'image/webp',
      });

      try {
        await s3Client.send(command);
      } catch (error) {
        throw error;
      }

      return Key;
    },
  );
}
