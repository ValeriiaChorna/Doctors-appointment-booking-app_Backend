import { Appointment } from "@/entities/Appointment";
import { BookAppointmentInput } from "@/models/appointments/BookAppointmentInput";
import { NotImplementedException } from "@/models/errors/NotImplementedException";
import { AppointmentService } from "@/services/AppointmentService";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class AppointmentResolver {
  constructor(
    private readonly appointmentService: AppointmentService,
  ) {}
  
  @Query(() => [Appointment])
  async appointments(): Promise<Appointment[]> {
    return this.appointmentService.getAppointments();
  }

  @Mutation(() => Appointment)
  async bookAppointment(
    @Arg("bookAppointmentInput") bookAppointmentInput: BookAppointmentInput,
  ): Promise<Appointment> {
    throw new NotImplementedException("bookAppointment");
  }
}