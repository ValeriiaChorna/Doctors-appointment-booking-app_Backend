import { Field, InputType } from "type-graphql";

@InputType()
export class AddDoctorAvailabilityInput {
  @Field()
  doctorId: string;

  @Field()
  dayOfWeek: number;

  @Field()
  startTimeUtc: string;

  @Field()
  endTimeUtc: string;
}
