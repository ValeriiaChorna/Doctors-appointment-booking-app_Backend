import { Appointment } from "@/entities/Appointment";
import { BookAppointmentInput } from "@/models/appointments/BookAppointmentInput";
import { NotImplementedException } from "@/models/errors/NotImplementedException";
import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

@Service()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
   
  ) {}

  getAppointments(): Promise<Appointment[]> {
    return this.appointmentRepo.find();
  }

  bookAppointment(options: BookAppointmentInput): Promise<Appointment> {
    throw new NotImplementedException('bookAppointment not implemented');
  }
}