import { Hono } from 'hono';
import { Element } from '@proshootai/core/element';
import { AuthenticatedUser } from '../types';

export const element = new Hono<{ Variables: AuthenticatedUser }>();

element
  .get('/', async (c) => {
    const user = c.get('user');

    if (!user) c.status(401);
    const userId = user.sub;
    console.log('userId', userId);
    return c.json({ result: await Element.list(userId) }, 200);
  })
  .get('/example', (c) => {
    return c.json([
      {
        SK: 'IMG#fg7ht56g7f9dfv',
        PK: 'CATEGORY#Furniture',
        image: 'https://example.com',
      },
      {
        SK: 'IMG#fg7ht56g7f9dfv',
        PK: 'CATEGORY#Bottles',
        image: 'https://example.com',
      },
      {
        SK: 'IMG#fg7ht56g7f9dfv',
        PK: 'CATEGORY#Bottles',
        image: 'https://example.com',
      },
    ]);
  });
