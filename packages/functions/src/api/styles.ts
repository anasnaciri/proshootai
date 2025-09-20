import { Hono } from 'hono';
import { Style } from '@proshootai/core/style';

const style = new Hono();
//export const project = new Hono();

export const styles = new Hono();

style
  .get('/', async (c) => {
    return c.json({ result: await Style.listCategories() }, 200);
  })
  .get('/:id', async (c) => {
    const categoryId = c.req.param('id');

    return c.json({ result: await Style.listCategory(categoryId) }, 200);
  });

const category = {
  PK: 'CAT#Furniture',
  SK: 'META#Furniture',
  name: 'Furniture',
  previewImages: [
    'https://example.com',
    'https://example.com',
    'https://example.com',
  ],
};

const items = [
  {
    PK: 'CAT#Furniture',
    SK: 'IMG#fg7ht56g7f9dfv',
    image: 'https://example.com',
    description: 'super magicall scenery',
  },
  {
    PK: 'CAT#Bottles',
    SK: 'IMG#fg7ht56g7f9dfv',
    image: 'https://example.com',
    description: 'super magicall scenery',
  },
  {
    PK: 'CAT#Bottles',
    SK: 'IMG#fg7ht56g7f9dfv',
    image: 'https://example.com',
    description: 'super magicall scenery',
  },
];
