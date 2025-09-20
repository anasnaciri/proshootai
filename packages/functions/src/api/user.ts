import { Hono } from 'hono';
import { User } from '@proshootai/core/user';

export const user = new Hono();

user
  .get('/', async (c) => {
    return c.json({ result: await User.list() }, 200);
  })
  .get('/:id', async (c) => {
    const id = c.req.param('id');
    return c.json({ result: await User.fromId(id) }, 200);
  })
  .post('/', async (c) => {
    const user: User.Info = await c.req.json();
    const createdUser = await User.create(user);
    return c.json({ result: createdUser }, 200);
  })
  .put('/:id', async (c) => {
    const id = c.req.param('id');
    const { name, stripeCustomerId } = await c.req.json();
    return c.json(
      {
        result: await User.update({ id, name, stripeCustomerId }),
      },
      200,
    );
  })
  .delete('/:id', async (c) => {
    const id = c.req.param('id');
    const { userId } = await c.req.json();
    return c.json(
      {
        result: await User.remove({ userId }),
      },
      200,
    );
  });
