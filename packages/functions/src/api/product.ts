import { Hono, Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { Product } from '@proshootai/core/product';
import { AuthenticatedUser } from '../types';

export const product = new Hono<{ Variables: AuthenticatedUser }>();

// Utility to convert bytes to MB for readable limits
const MB = (n: number) => n * 1024 * 1024;

const fileValidator = async (
  image: File,
  options: {
    maxSize?: number;
    allowedTypes?: string[];
  },
) => {
  if (options.maxSize && image.size > options.maxSize) {
    throw new HTTPException(400, {
      message: `File too large. Max size is ${options.maxSize / MB(1)}MB`,
    });
  }

  if (options.allowedTypes && !options.allowedTypes.includes(image.type)) {
    throw new HTTPException(400, {
      message: `Invalid image type. Allowed: ${options.allowedTypes.join(', ')}`,
    });
  }
};
const validateUpload =
  (options: { maxSize?: number; allowedTypes?: string[] }) =>
  async (c: Context, next: Next) => {
    const contentType = c.req.header('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      throw new HTTPException(400, { message: 'Invalid content type' });
    }

    const formData = await c.req.formData();
    const image = formData.get('image');

    if (!image || !(image instanceof File)) {
      throw new HTTPException(400, { message: 'No image provided' });
    }

    await fileValidator(image, options);

    await next();
  };

product
  .get('/', async (c) => {
    const user = c.get('user');

    if (!user) c.status(401);
    const userId = user.sub;
    console.log('userId', userId);
    return c.json({ result: await Product.list(userId) }, 200);
  })
  .get('/:id', async (c) => {
    const user = c.get('user');
    const userId = user.sub;
    const productId = c.req.param('id');

    return c.json(
      { result: await Product.fromId({ id: productId, user: userId }) },
      200,
    );
  })
  .post(
    '/',
    // validateUpload({
    //   maxSize: MB(20),
    //   allowedTypes: [
    //     'image/jpeg',
    //     'image/jpg',
    //     'image/png',
    //     'application/webp',
    //   ],
    // }),
    async (c) => {
      const user = c.get('user');
      const userId = user.sub;
      const formData = await c.req.formData();

      //console.log('request', formData);
      const image = formData.get('image') as File;
      const imageType = image.type;
      const imageExtension = image.name.split('.').pop() || '.png';

      console.log('type', imageType);
      const imageBuffer = await image.arrayBuffer();
      const productName = formData.get('productName') as string;

      if (!image || !productName) {
        return c.json({ error: 'Missing required fields' }, 400);
      }
      const key = await Product.uploadToS3({
        user: userId,
        productImage: Buffer.from(imageBuffer),
        contentType: imageType,
        imageExtension,
      });
      const newProduct = {
        user: userId,
        name: productName,
        image: key,
      };

      return c.json({ result: await Product.create(newProduct) }, 200);
    },
  )
  .put('/:id', async (c) => {
    const user = c.get('user');
    const userId = user.sub;
    const { name } = await c.req.json();
    const productId = c.req.param('id');
    const newProduct = {
      id: productId,
      user: userId,
      name,
    };

    return c.json({ result: await Product.update(newProduct) }, 200);
  })
  .delete('/:id', async (c) => {
    const user = c.get('user');
    const userId = user.sub;
    const productId = c.req.param('id');
    const product = await Product.fromId({ id: productId, user: userId });

    console.log('product', product);

    if (!product) return c.json({ error: 'Product not found' }, 404);

    return c.json(
      {
        result: await Product.remove({ userId, productId, key: product.image }),
      },
      200,
    );
  });
