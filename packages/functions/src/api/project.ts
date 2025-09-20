import { Hono } from 'hono';
import { DesignStudioProject } from '@proshootai/core/designStudioProject';
import { AuthenticatedUser } from '../types';
import sharp from 'sharp';

const designStudioProject = new Hono<{ Variables: AuthenticatedUser }>();
export const project = new Hono();

designStudioProject
  .get('/', async (c) => {
    const user = c.get('user');
    const userId = user.sub;

    return c.json({ result: await DesignStudioProject.list(userId) }, 200);
  })
  .get('/recent', async (c) => {
    const user = c.get('user');
    const userId = user.sub;

    return c.json(
      { result: await DesignStudioProject.listRecent(userId) },
      200,
    );
  })
  .get('/:id', async (c) => {
    const user = c.get('user');
    const userId = user.sub;
    const projectId = c.req.param('id');

    return c.json(
      { result: await DesignStudioProject.fromId({ projectId, userId }) },
      200,
    );
  })
  .post('/', async (c) => {
    const user = c.get('user');
    const userId = user.sub;

    return c.json(
      {
        result: await DesignStudioProject.create({
          user: userId,
          title: 'untitled_project',
        }),
      },
      200,
    );
  })
  .put('/:id', async (c) => {
    const user = c.get('user');
    const userId = user.sub;
    const { title, canvas, preview } = await c.req.json();
    const projectId = c.req.param('id');
    const newProject = {
      id: projectId,
      user: userId,
      title,
      canvas,
      preview,
    };

    console.log({ canvas });

    if (newProject.preview) {
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
            .resize(700, 700, {
              fit: 'inside',
              withoutEnlargement: true,
            })
            .webp({
              quality: 80,
              effort: 6,
            })
            .toBuffer();

          return compressedImage;
        } catch (error) {
          console.error('Error compressing image:', error);
          throw error;
        }
      };

      const key = await DesignStudioProject.uploadToS3({
        ...newProject,
        preview: await compressImage(preview),
      });

      newProject.preview = key;
    }

    return c.json(
      { result: await DesignStudioProject.update(newProject) },
      200,
    );
  })
  .delete('/:id', async (c) => {
    const user = c.get('user');
    const userId = user.sub;
    const projectId = c.req.param('id');

    return c.json(
      { result: await DesignStudioProject.remove({ userId, projectId }) },
      200,
    );
  });

project.route('/design', designStudioProject);
