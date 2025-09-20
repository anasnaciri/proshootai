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
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { fn } from '../util/fn';
import { createID } from '../util/id';

export module Generation {
  export const Info = z.object({
    id: z.string(),
    user: z.string(),
    project: z.string(),
    status: z.enum(['PROCESSING', 'COMPLETE', 'FAILED']),
    image: z.string().nullable(),
    created_at: z.string(),
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
        ':sk': 'GEN#',
      }),
    };

    const command = new QueryCommand(input);
    const response = await client.send(command);

    const items = response.Items?.map((item) => unmarshall(item));
    return items;
  });

  export const fromId = fn(
    z.object({ userId: z.string(), generationId: z.string() }),
    async (generation) => {
      const input: GetItemCommandInput = {
        TableName: Resource.Projects.name,
        Key: marshall({
          PK: `USER#${generation.userId}`,
          SK: `GEN#${generation.generationId}`,
        }),
      };

      const command = new GetItemCommand(input);
      const response = await client.send(command);

      if (!response.Item) {
        throw new Error('Generation not found');
      }

      return unmarshall(response.Item);
    },
  );

  export const fromProjectId = fn(z.string(), async (projectId) => {
    const input: QueryCommandInput = {
      TableName: Resource.Projects.name,
      IndexName: 'ProjectIndex',
      KeyConditionExpression: '#project = :projectId AND begins_with(#SK, :sk)',
      ExpressionAttributeNames: {
        '#project': 'project',
        '#SK': 'SK',
      },
      ExpressionAttributeValues: marshall({
        ':projectId': projectId,
        ':sk': 'GEN#',
      }),
    };

    const command = new QueryCommand(input);
    const response = await client.send(command);

    const items = response.Items?.map((item) => unmarshall(item));
    return items;
  });

  export const update = fn(
    Info.pick({ id: true, user: true, status: true, image: true }).partial({
      image: true,
    }),
    async (generation) => {
      const updateExpressions: string[] = [];
      const expressionAttributeValues: Record<string, any> = {};
      const expressionAttributeNames: Record<string, string> = {};

      if (generation.status !== null) {
        updateExpressions.push('#status = :status');
        expressionAttributeValues[':status'] = generation.status;
        expressionAttributeNames['#status'] = 'status';
      }

      if (generation.image !== null) {
        updateExpressions.push('#image = :image');
        expressionAttributeValues[':image'] = generation.image;
        expressionAttributeNames['#image'] = 'image';
      }

      if (updateExpressions.length === 0) {
        return null; // No fields to update
      }

      const input: UpdateItemCommandInput = {
        TableName: Resource.Projects.name,
        Key: marshall({
          PK: `USER#${generation.user}`,
          SK: `GEN#${generation.id}`,
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
    Info.pick({ user: true, project: true }),
    async (generation) => {
      const item = {
        PK: `USER#${generation.user}`,
        SK: createID('generation'),
        project: generation.project,
        status: 'PROCESSING',
        created_at: new Date().toISOString(),
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
    z.object({
      userId: z.string(),
      generationId: z.string(),
      imageKey: z.string(),
    }),
    async (generation) => {
      if (generation.imageKey) {
        const command = new DeleteObjectCommand({
          Bucket: Resource.Uploads.name,
          Key: generation.imageKey,
        });

        try {
          await s3Client.send(command);
        } catch (error) {
          throw error;
        }
      }

      const input: DeleteItemCommandInput = {
        TableName: Resource.Projects.name,
        Key: marshall({
          PK: `USER#${generation.userId}`,
          SK: `GEN#${generation.generationId}`,
        }),
      };

      const deleteCommand = new DeleteItemCommand(input);
      const response = await client.send(deleteCommand);

      return response;
    },
  );

  //should become only upload and s3 logic should move to a utility function
  export const uploadToS3 = fn(
    Info.pick({ user: true, project: true, id: true }).extend({
      generatedImage: z.instanceof(Buffer),
    }),
    async (generation) => {
      const Key = `/${generation.user}/generations/${generation.project}/${generation.id}`;
      const command = new PutObjectCommand({
        Bucket: Resource.Uploads.name,
        Key,
        Body: generation.generatedImage,
        ContentType: 'image/png',
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
