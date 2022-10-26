import { Field, InputType } from "type-graphql";
import { Slot } from "./Slot";

@InputType()
export class BookAppointmentInput {
  @Field()
  slot: Slot;

  @Field()
  patientName: string;

  @Field()
  description: string;
}