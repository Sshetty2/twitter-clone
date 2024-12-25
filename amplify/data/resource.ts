import { defineData, type ClientSchema, a } from '@aws-amplify/backend';

const schema = a.schema({
  Tweet: a.model({
    content  : a.string().required(),
    author   : a.string().required(),
    createdAt: a.datetime().required(),
    likes    : a.integer().default(0)
  })
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({ schema });
