import { Appointment } from "@/entities/Appointment";
import { Doctor } from "@/entities/Doctor";
import { BookAppointmentInput } from "@/models/appointments/BookAppointmentInput";
import { NotValidRequest } from "@/models/errors/NotValidRequest";
import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";

@Service()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>
  ) {}

  getAppointments(): Promise<Appointment[]> {
    return this.appointmentRepo.find();
  }

  async bookAppointment(options: BookAppointmentInput): Promise<Appointment> {
    const { slot, patientName, description } = options;

    if (!slot || !slot.doctorId || !slot.start) {
      throw new NotValidRequest("bookAppointment: invalid data");
    }

    const existedAppointment = await this.appointmentRepo.findOne({
      where: { doctor: { id: slot.doctorId }, startTime: slot.start },
      relations: ["doctor"],
    });
    if (existedAppointment) {
      throw new NotValidRequest("Appointment slot already taken");
    }

    const doctor = await this.doctorRepo.findOne({
      where: { id: slot.doctorId },
    });

    const newAppointment = new Appointment();
    newAppointment.doctor = doctor;
    newAppointment.startTime = slot.start;
    newAppointment.patientName = patientName;
    newAppointment.description = description;

    return this.appointmentRepo.save(newAppointment);
  }
}
