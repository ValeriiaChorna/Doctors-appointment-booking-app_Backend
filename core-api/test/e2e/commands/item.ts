import supertest from 'supertest';

import AddItemInput from '../../../src/models/items/AddItemInput';
import { Api } from '../api';

export const addItem = (api: Api, item: AddItemInput): supertest.Test =>
  api.post('').send({
    query: `
      mutation ($item: AddItemInput!) {
        addItem(item: $item) {
          id
          name
        }
      }
  `,
    variables: {
      item,
    },
  });

export const fetchItems = (api: Api): supertest.Test =>
  api.post('').send({
    query: `
      query items {
        items {
          description
          id
          name
        }
      }
    `,
  });
