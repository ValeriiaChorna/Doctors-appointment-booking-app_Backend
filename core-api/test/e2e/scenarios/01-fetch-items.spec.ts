import { faker } from '@faker-js/faker';

import Item from '../../../src/entities/Item';
import { createApi } from '../api';
import { fetchItems, addItem } from '../commands/item';

const api = createApi();

describe('Items resolver', () => {
  it('addItems: should add items successfully', async () => {
    const itemToAdd = { name: faker.name.jobTitle() };

    const res = await addItem(api, itemToAdd);

    expect(res.status).toBe(200);

    const item = res.body.data.addItem as Item;

    expect(item?.id).toBeGreaterThan(0);
  });

  it('fetchItems: should retrieve items successfully', async () => {
    const res = await fetchItems(api);

    expect(res.status).toBe(200);

    const items = res.body.data.items as Item[];

    expect(items?.length).toBeGreaterThan(0);
  });
});
