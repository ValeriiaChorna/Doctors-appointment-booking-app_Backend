import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import Item from '../entities/Item';
import AddItemInput from '../models/items/AddItemInput';

@Resolver(() => Item)
export class ItemResolver {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepo: Repository<Item>
  ) {}

  @Query(() => [Item])
  async items(): Promise<Item[]> {
    return this.itemRepo.find();
  }

  @Mutation(() => Item)
  async addItem(@Arg('item') item: AddItemInput): Promise<Item> {
    const newItem = new Item();
    newItem.name = item.name;
    newItem.description = item.description;
    
    return this.itemRepo.save(newItem);
  }
}
