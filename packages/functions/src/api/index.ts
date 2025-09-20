// import { Resource } from 'sst';
// import { Handler } from 'aws-lambda';
// import { Example } from '@proshootai/core/example';

// export const handler: Handler = async (_event) => {
//   return {
//     statusCode: 200,
//     body: `${Example.hello()} Linked to the resource:  ${Resource.Uploads.name}.`,
//   };
// };

import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';
import { cors } from 'hono/cors';
import { product } from './product';
import { project } from './project';
import { user } from './user';
import { generation } from './generation';
import { element } from './element';
import { categorie } from './categories';
import { createMiddleware } from 'hono/factory';
import { AuthenticatedUser } from '../types';

const app = new Hono<{ Variables: AuthenticatedUser }>();

app.use('/*', cors());

const authMiddleWare = createMiddleware(async (c, next) => {
  const env: any = c.env;
  const claims = env.requestContext.authorizer.jwt.claims;
  const user = {
    name: claims.name,
    email: claims.email,
    sub: claims.sub,
  };
  c.set('user', user);
  await next();
});

app.use('/*', authMiddleWare);

app.get('/', (c) => {
  const user = c.get('user');
  const name = user.name;
  return c.json({
    message: `Welcome to Proshoot! ${name}`,
    user,
  });
});

app
  .route('/products', product)
  .route('/projects', project)
  .route('/users', user)
  .route('/generations', generation)
  .route('/elements', element)
  .route('/categories', categorie);

export const handler = handle(app);
