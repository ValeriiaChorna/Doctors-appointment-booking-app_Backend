import { Field, InputType, ObjectType } from "type-graphql";

@InputType('slotInput')
@ObjectType()
export class Slot {
  @Field()
  doctorId: number;

  @Field()
  start: Date;

  @Field()
  end: Date;
}