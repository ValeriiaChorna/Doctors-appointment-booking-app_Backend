import { Doctor } from "@/entities/Doctor";
import { Slot } from "@/models/appointments/Slot";
import { NotImplementedException } from "@/models/errors/NotImplementedException";
import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

@Service()
export class DoctorService {

  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>,
  ) {}

  getDoctors() {
    return this.doctorRepo.find();
  }

  addDoctor(): Promise<Doctor> {
    throw new NotImplementedException("addDoctor: Not implemented!")
  }

  getAvailableSlots(from: Date, to: Date): Promise<Slot[]> {
    throw new NotImplementedException('getAvailableSlots: Not implemented!');
  }
}