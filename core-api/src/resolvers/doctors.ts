import { Doctor } from "@/entities/Doctor";
import { Slot } from "@/models/appointments/Slot";
import { AddDoctorInput } from "@/models/doctor/AddDoctorInput";
import { NotImplementedException } from "@/models/errors/NotImplementedException";
import { DoctorService } from "@/services/DoctorService";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver(() => Doctor)
export class DoctorResolver {
  constructor(
    private readonly doctorService: DoctorService,
  ) {}
  
  @Query(() => [Doctor])
  async doctors(): Promise<Doctor[]> {
    return this.doctorService.getDoctors();
  }

  @Mutation(() => Doctor)
  async addDoctor(
    @Arg('doctor') doctor: AddDoctorInput,
  ): Promise<Doctor> {
    throw new NotImplementedException("addDoctor: not implemented")
  }

  @Query(() => [Slot])
  async slots(
    @Arg('from') from: Date,
    @Arg('to') to: Date,
  ): Promise<Slot[]> {
    throw new NotImplementedException("slots")
  }
}