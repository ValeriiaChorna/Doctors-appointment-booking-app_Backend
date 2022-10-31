import { Doctor } from "@/entities/Doctor";
import { Availability } from "@/entities/Availability";
import { Slot } from "@/models/appointments/Slot";
import { AddDoctorAvailabilityInput } from "@/models/doctor/AddDoctorAvailabilityInput";
import { AddDoctorInput } from "@/models/doctor/AddDoctorInput";
import { DoctorService } from "@/services/DoctorService";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver(() => Doctor)
export class DoctorResolver {
  constructor(private readonly doctorService: DoctorService) {}

  @Query(() => [Doctor])
  async doctors(): Promise<Doctor[]> {
    return this.doctorService.getDoctors();
  }

  @Mutation(() => Doctor)
  async addDoctor(@Arg("doctor") doctor: AddDoctorInput): Promise<Doctor> {
    return this.doctorService.addDoctor(doctor);
  }

  @Query(() => [Slot])
  async slots(@Arg("from") from: Date, @Arg("to") to: Date): Promise<Slot[]> {
    return this.doctorService.getAvailableSlots(from, to);
  }

  @Mutation(() => Availability)
  async addDoctorAvailability(
    @Arg("availability") availability: AddDoctorAvailabilityInput
  ): Promise<Availability> {
    return this.doctorService.addDoctorAvailability(availability);
  }
}
