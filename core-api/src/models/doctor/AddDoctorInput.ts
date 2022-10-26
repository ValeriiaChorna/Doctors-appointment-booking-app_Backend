import { Field, InputType } from "type-graphql";

@InputType()
export class AddDoctorInput {
  @Field()
  name: string;
}