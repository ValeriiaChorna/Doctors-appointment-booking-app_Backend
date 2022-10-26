import { Field, InputType } from 'type-graphql';

@InputType()
export default class AddItemInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;
}
