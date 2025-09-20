import { Hono } from 'hono';

export const categorie = new Hono();

categorie.get('/', (c) => {
  return c.json([
    {
      PK: 'CAT',
      SK: 'CAT#fe6g5f786fd6G',
      name: 'Furniture',

      previewImages: [
        'https://example.com',
        'https://example.com',
        'https://example.com',
      ],
    },
    {
      PK: 'CAT',
      SK: 'CAT#fefg5f78dffku',
      name: 'Flowers',

      previewImages: [
        'https://example.com',
        'https://example.com',
        'https://example.com',
      ],
    },
    {
      PK: 'CAT',
      SK: 'CAT#fe6g5f786fd6fa',
      name: 'Bottles',

      previewImages: [
        'https://example.com',
        'https://example.com',
        'https://example.com',
      ],
    },
  ]);
});
