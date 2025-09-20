import { Hono } from 'hono';
import { Generation } from '@proshootai/core/generation';
import { AuthenticatedUser } from '../types';
import { Lambda } from '@aws-sdk/client-lambda';
import sharp from 'sharp';

import { Resource } from 'sst';

export const generation = new Hono<{ Variables: AuthenticatedUser }>();

const lambda = new Lambda({});

generation
  .get('/', async (c) => {
    // return c.json([
    //   {
    //     id: 1,
    //     project: 'PROJECT#001',
    //     generated_image: 'https://example.com',
    //     status: 'COMPLETE',
    //     createdAt: new Date(),
    //     image: 'input : base64 created scene',
    //     mask: 'input : base 64 created mask',
    //     prompt: 'input : prompt',
    //     style: 'input: link to reference image for the ipAdapter',
    //   },
    // ]);

    const user = c.get('user');

    if (!user) c.status(401);
    const userId = user.sub;
    console.log('userId', userId);
    return c.json({ result: await Generation.list(userId) }, 200);
  })
  .get('/projects/:id', async (c) => {
    const projectId = c.req.param('id');
    return c.json({
      result: await Generation.fromProjectId(projectId),
    });
  })
  .get('/:id', async (c) => {
    const user = c.get('user');
    const userId = user.sub;
    const generationId = c.req.param('id');
    return c.json({
      result: await Generation.fromId({ userId, generationId }),
    });
  })
  .post('/', async (c) => {
    try {
      const { image, mask, prompt, style, project } = await c.req.json();
      const user = c.get('user');
      const userId = user.sub;

      // Create initial generation record
      const generation = await Generation.create({
        user: userId,
        project,
      });

      const compressImage = async (base64String: string) => {
        try {
          if (base64String.startsWith('data:image')) {
            // Remove the data URI prefix if present
            base64String = base64String.split(',')[1];
          }
          // Convert base64 to buffer
          const imageBuffer = Buffer.from(base64String, 'base64');

          // Compress image
          const compressedImage = await sharp(imageBuffer)
            .resize(1024, 1024, {
              fit: 'inside',
              withoutEnlargement: true,
            })
            .png({
              quality: 90,
            })
            .toBuffer();

          // Convert back to base64
          return compressedImage.toString('base64');
        } catch (error) {
          console.error('Error compressing image:', error);
          throw error;
        }
      };

      const compressedImage = await compressImage(image);
      const compresseedMask = await compressImage(mask);

      //long runing process
      await lambda.invoke({
        FunctionName: Resource.imageProcessingWorker.name,
        InvocationType: 'Event', // This makes it asynchronous
        Payload: JSON.stringify({
          generationId: generation.SK.split('#')[1],
          image: compressedImage,
          mask: compresseedMask,
          prompt,
          style,
          userId,
          project,
        }),
      });

      return c.json(
        {
          id: generation.SK,
          status: 'PENDING',
        },
        202,
      ); // 202 Accepted is more appropriate for async operations
    } catch (error) {
      // Handle errors in the initial request
      console.error('Failed to start generation:', error);
      return c.json(
        {
          error: 'Failed to start generation process',
        },
        500,
      );
    }
  })
  .delete('/:id', async (c) => {
    const generationId = c.req.param('id');
    const { userId } = await c.req.json();
    const generation = await Generation.fromId({ userId, generationId });

    if (!generation) return c.json({ error: 'Generation not found' }, 404);
  });
