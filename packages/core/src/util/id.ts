import { ulid } from 'ulid';

const prefixes = {
  user: 'USER',
  subscription: 'SUB',
  category: 'CAT',
  generation: 'GEN',
  product: 'PRD',
  prop: 'PROP',
  style: 'STYLE',
  dsProject: 'PRJCTDS',
} as const;

export function createID(prefix: keyof typeof prefixes): string {
  return [prefixes[prefix], ulid()].join('#');
}
