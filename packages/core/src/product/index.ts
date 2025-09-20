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
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { fn } from '../util/fn';
import { createID } from '../util/id';
import { processImage } from '../util/processImage';
import { ulid } from 'ulid';

export module Product {
  export const Info = z.object({
    id: z.string(),
    user: z.string(),
    name: z.string().min(3),
    image: z.string(),
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
        ':sk': 'PRD#',
      }),
    };

    const command = new QueryCommand(input);
    const response = await client.send(command);

    const items = response.Items?.map((item) => unmarshall(item));
    return items;
  });

  export const fromId = fn(
    z.object({ user: z.string(), id: z.string() }),
    async (product) => {
      const input: GetItemCommandInput = {
        TableName: Resource.Projects.name,
        Key: marshall({
          PK: `USER#${product.user}`,
          SK: `PRD#${product.id}`,
        }),
      };

      const command = new GetItemCommand(input);
      const response = await client.send(command);

      if (!response.Item) {
        throw new Error('Product not found');
      }

      return unmarshall(response.Item);
    },
  );

  export const update = fn(Info.omit({ image: true }), async (product) => {
    const updateExpressions: string[] = [];
    const expressionAttributeValues: Record<string, any> = {};
    const expressionAttributeNames: Record<string, string> = {};

    if (product.name !== null) {
      updateExpressions.push('#name = :name');
      expressionAttributeValues[':name'] = product.name;
      expressionAttributeNames['#name'] = 'name';
    }

    if (updateExpressions.length === 0) {
      return null; // No fields to update
    }

    const input: UpdateItemCommandInput = {
      TableName: Resource.Projects.name,
      Key: marshall({
        PK: `USER#${product.user}`,
        SK: `PRD#${product.id}`,
      }),
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeValues: marshall(expressionAttributeValues),
      ExpressionAttributeNames: expressionAttributeNames,
    };

    const command = new UpdateItemCommand(input);
    const response = await client.send(command);

    return response;
  });

  export const create = fn(Info.omit({ id: true }), async (product) => {
    const input: PutItemInput = {
      TableName: Resource.Projects.name,
      Item: marshall({
        PK: `USER#${product.user}`,
        SK: createID('product'),
        name: product.name,
        image: product.image,
      }),
    };

    const command = new PutItemCommand(input);
    const response = await client.send(command);

    return response;
  });

  export const remove = fn(
    z.object({
      userId: z.string(),
      productId: z.string(),
      key: z.string().optional(),
    }),
    async (product) => {
      const input: DeleteItemCommandInput = {
        TableName: Resource.Projects.name,
        Key: marshall({
          PK: `USER#${product.userId}`,
          SK: `PRD#${product.productId}`,
        }),
      };

      if (product.key) {
        const command = new DeleteObjectCommand({
          Bucket: Resource.Uploads.name,
          Key: product.key,
        });

        try {
          await s3Client.send(command);
        } catch (error) {
          throw error;
        }
      }

      const command = new DeleteItemCommand(input);
      const response = await client.send(command);

      return response;
    },
  );

  //make one uplaod image function, this function will use the 3rd party service (S3, R2, etc) to upload the image
  //add a new function to create a miniaturized version of the image
  //Reject NSFW images
  export const uploadToS3 = fn(
    Info.pick({ user: true }).extend({
      productImage: z.instanceof(Buffer),
      imageExtension: z.string(),
      contentType: z.string(),
    }),
    async (product) => {
      const id = ulid();
      const Key = `/${product.user}/products/${id}.${product.imageExtension}`;

      const processedBuffer = await processImage(product.productImage, {
        maxWidth: 1080,
        maxHeight: 1080,
        quality: 90,
      });

      const command = new PutObjectCommand({
        Bucket: Resource.Uploads.name,
        Key,
        Body: processedBuffer,
        ContentType: product.contentType,
        //ACL: 'public-read',
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
