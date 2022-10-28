import { Doctor } from "@/entities/Doctor";
import { Availability } from "@/entities/Availability";
import { Slot } from "@/models/appointments/Slot";
import { AddDoctorAvailabilityInput } from "@/models/doctor/AddDoctorAvailabilityInput";
import { NotValidRequest } from "@/models/errors/NotValidRequest";
import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import {
  getDay,
  differenceInDays,
  addDays,
  nextDay,
  isBefore,
  addMinutes,
  setHours,
  setMinutes,
  getHours,
  getMinutes, setSeconds, setMilliseconds,
} from "date-fns";
import { AddDoctorInput } from "@/models/doctor/AddDoctorInput";
import {Appointment} from "@/entities/Appointment";

@Service()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>,
    @InjectRepository(Availability)
    private readonly availabilityRepo: Repository<Availability>,
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
  ) {}

  getDoctors() {
    return this.doctorRepo.find({
      relations: ["appointments", "availability"],
    });
  }

  async addDoctor(doctor: AddDoctorInput): Promise<Doctor> {
    if (!doctor.name) {
      throw new NotValidRequest("addDoctor: invalid name");
    }
    const existedDoctor = await this.doctorRepo.findOne({
      where: { name: doctor.name },
    });
    if (existedDoctor) {
      throw new NotValidRequest(
        "addDoctor: doctor with this name already exist"
      );
    }

    const newDoctor = new Doctor();
    newDoctor.name = doctor.name;

    return this.doctorRepo.save(newDoctor);
  }

  async addDoctorAvailability(
    availabilityObj: AddDoctorAvailabilityInput
  ): Promise<Availability> {
    const { dayOfWeek, doctorId, startTimeUtc, endTimeUtc } = availabilityObj;

    if (!dayOfWeek || !doctorId || !startTimeUtc || !endTimeUtc) {
      throw new NotValidRequest("addDoctorAvailability: invalid data");
    }

    const doctor = await this.doctorRepo.findOne({ where: { id: doctorId } });
    if (!doctor) {
      throw new NotValidRequest(
        "addDoctorAvailability: doctor with this id not found"
      );
    }

    const existedAvailability = await this.availabilityRepo.findOne({
      where: { dayOfWeek, doctor },
    });

    const newAvailability = new Availability();
    if (existedAvailability && existedAvailability.id) {
      newAvailability.id = existedAvailability.id;
    }
    newAvailability.doctor = doctor;
    newAvailability.dayOfWeek = Number(dayOfWeek);
    newAvailability.startTimeUtc = startTimeUtc;
    newAvailability.endTimeUtc = endTimeUtc;

    return this.availabilityRepo.save(newAvailability);
  }

  getDoctorWorkDays(fromDate: Date, toDate: Date, workDayOfWeek: Day) {
    let doctorWorkDays: Date[] = [];

    if (getDay(fromDate) === workDayOfWeek) {
      doctorWorkDays.push(fromDate);
    }
    const nextStartDay = nextDay(fromDate, workDayOfWeek);
    if (!doctorWorkDays.length && isBefore(nextStartDay, toDate)) {
      doctorWorkDays.push(nextStartDay);
    }

    if (doctorWorkDays.length) {
      let currentDay = doctorWorkDays[doctorWorkDays.length - 1];
      while (isBefore(addDays(currentDay, 7), toDate)) {
        doctorWorkDays.push(addDays(currentDay, 7));
        currentDay = addDays(currentDay, 7);
      }
    }

    return doctorWorkDays;
  }

  async getAvailableSlots(from: Date, to: Date): Promise<Slot[]> {
    if (!from || !to) {
      throw new NotValidRequest("getAvailableSlots: invalid data");
    }
    const periodLimit = 30;
    let slots: Slot[] = [];
    const fromDate = setMilliseconds(setSeconds(new Date(from),0),0);
    const endDate =
      differenceInDays(fromDate, new Date(to)) < periodLimit
        ? new Date(to)
        : addDays(fromDate, periodLimit);
    const slotDuration = 15;

    const doctors = await this.getDoctors();
    if (!doctors.length) {
      throw new NotValidRequest("getAvailableSlots: no doctor found");
    }

    if (doctors && doctors.length) {
      slots = doctors.reduce((slotRes, doctor) => {
        const { availability, appointments } = doctor;
        console.log('appointments',doctor.appointments)

        availability.forEach((availabilityItem) => {
          const {
            dayOfWeek,
            startTimeUtc: startWorkTime,
            endTimeUtc: endWorkTime,
          } = availabilityItem;

          const doctorWorkDays = this.getDoctorWorkDays(
            fromDate,
            endDate,
            dayOfWeek as Day
          );

          if (doctorWorkDays.length) {
            const [startHours, startMinutes] = startWorkTime.split(":");
            const [endHours, endMinutes] = endWorkTime.split(":");

            doctorWorkDays.forEach((date) => {
              const endDateFixed = setMinutes(
                setHours(new Date(endDate), getHours(endDate)),
                getMinutes(endDate) + 1
              );
              const dayStartTime = setMinutes(
                setHours(new Date(date), Number(startHours)),
                Number(startMinutes) || 0
              );
              const dayEndTime = setMinutes(
                setHours(new Date(date), Number(endHours)),
                Number(endMinutes) + 1
              );

              const existedAppointmentByStartTime = (startTime: Date) =>
                appointments && appointments.length
                  ? appointments.find((item) => setMilliseconds(setSeconds(new Date(item.startTime),0),0) === startTime)
                  : null;

              const dayEndTimeFinal = isBefore(dayEndTime, endDateFixed)
                ? dayEndTime
                : endDateFixed;

              let currentStartTime = dayStartTime;
              while (
                isBefore(
                  addMinutes(currentStartTime, slotDuration),
                  dayEndTimeFinal
                )
              ) {
                const currentEndTime = addMinutes(
                  currentStartTime,
                  slotDuration
                );

                if (!existedAppointmentByStartTime(currentStartTime)) {
                  const slotItem = new Slot();
                  slotItem.doctorId = doctor.id;
                  slotItem.start = currentStartTime;
                  slotItem.end = currentEndTime;

                  slotRes.push(slotItem);
                }

                currentStartTime = currentEndTime;
              }
            });
          }
        });
        return slotRes;
      }, []);
    }

    return slots;
  }
}
