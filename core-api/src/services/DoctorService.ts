import { Doctor } from "@/entities/Doctor";
import { Availability } from "@/entities/Availability";
import { Appointment } from "@/entities/Appointment";
import { Slot } from "@/models/appointments/Slot";
import { AddDoctorAvailabilityInput } from "@/models/doctor/AddDoctorAvailabilityInput";
import { NotValidRequest } from "@/models/errors/NotValidRequest";
import { Service } from "typedi";
import { Repository } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import {
  differenceInDays,
  addDays,
  isBefore,
  addMinutes,
  setHours,
  setMinutes,
  getMinutes,
  setSeconds,
  setMilliseconds, isEqual,
} from "date-fns";
import { AddDoctorInput } from "@/models/doctor/AddDoctorInput";
import {Utils} from "@/utils/Utils";

@Service()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>,
    @InjectRepository(Availability)
    private readonly availabilityRepo: Repository<Availability>,
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    private utils: Utils,
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

  async getAvailableSlots(from: Date, to: Date): Promise<Slot[]> {
    if (!from || !to) {
      throw new NotValidRequest("getAvailableSlots: invalid data");
    }
    const periodLimit = 30;
    let slots: Slot[] = [];
    const fromDateRequested = setMilliseconds(setSeconds(new Date(from), 0), 0);
    const endDateRequested =
      differenceInDays(fromDateRequested, new Date(to)) < periodLimit
        ? setMinutes(new Date(to), getMinutes(to) + 1)
        : setMinutes(
            addDays(fromDateRequested, periodLimit),
            getMinutes(fromDateRequested) + 1
          );
    const slotDuration = 15;

    const doctors = await this.getDoctors();
    if (!doctors.length) {
      throw new NotValidRequest("getAvailableSlots: no doctor found");
    }

    if (doctors && doctors.length) {
      slots = doctors.reduce((slotRes, doctor) => {
        const { availability, appointments } = doctor;

        availability.forEach((availabilityItem) => {
          const {
            dayOfWeek,
            startTimeUtc: startWorkTime,
            endTimeUtc: endWorkTime,
          } = availabilityItem;

          const doctorWorkDays = this.utils.getWorkingDaysInTimeSpan(
            fromDateRequested,
            endDateRequested,
            dayOfWeek as Day
          );

          if (doctorWorkDays.length) {
            const [startHours, startMinutes] = startWorkTime.split(":");
            const [endHours, endMinutes] = endWorkTime.split(":");

            doctorWorkDays.forEach((date) => {
              const workDayStart = setMinutes(
                setHours(new Date(date), Number(startHours)),
                Number(startMinutes) || 0
              );
              const workDayEnd = setMinutes(
                setHours(new Date(date), Number(endHours)),
                Number(endMinutes) + 1
              );

              const workDayStartByReq = isBefore(
                workDayStart,
                fromDateRequested
              )
                ? fromDateRequested
                : workDayStart;

              const workDayEndByReq = isBefore(workDayEnd, endDateRequested)
                ? workDayEnd
                : endDateRequested;

              const existedAppointmentByStartTime = (startTime: Date) =>
                appointments && appointments.length
                  ? appointments.find(
                      (item) =>
                      {
                        const appointmentStartTimeFixed = setMilliseconds(
                            setSeconds(new Date(item.startTime), 0),
                            0
                        )
                        return isEqual(appointmentStartTimeFixed, startTime)
                      }
                    )
                  : null;

              let currentStartTime = workDayStartByReq;
              while (
                isBefore(
                  addMinutes(currentStartTime, slotDuration),
                  workDayEndByReq
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
