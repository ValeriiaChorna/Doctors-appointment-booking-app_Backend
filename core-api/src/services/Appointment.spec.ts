import { Appointment } from "@/entities/Appointment";
import { Doctor } from "@/entities/Doctor";
import { BookAppointmentInput } from "@/models/appointments/BookAppointmentInput";
import { faker } from "@faker-js/faker";
import createMockRepo from "@test/mocks/mockRepo";
import { addDays, addMinutes, nextMonday, setHours, setMinutes } from "date-fns";
import Container from "typedi";
import { ConnectionManager, Repository } from "typeorm";
import { AppointmentService } from "./AppointmentService";

const mockRepo: Partial<Repository<Appointment>> = {};

describe('AppointmentService', () => {
  beforeAll(() => {
    Container.set(ConnectionManager, createMockRepo(mockRepo));
  });

  describe('bookAppointment', () => {
    it('should not book duplicate appointment', async () => {
      const doctor = new Doctor();
      doctor.id = 1;

      const appointment = new Appointment()

      // set appointment start time to next monday at 2pm
      const startTime = setMinutes(setHours(addDays(nextMonday(new Date()), 1), 14), 0);
      appointment.startTime = startTime;
      appointment.durationMinutes = 15;
      appointment.doctor = doctor;

      mockRepo.findOne = jest.fn(() => {
        return Promise.resolve(appointment);
      });

      const sut = Container.get(AppointmentService);

      const bookAppointmentInput: BookAppointmentInput = {
        slot: { start: startTime, end: addMinutes(startTime, 15), doctorId: doctor.id },
        patientName: faker.name.firstName(),
        description: faker.lorem.lines(1),
      };

      const call = () => {
        sut.bookAppointment(bookAppointmentInput);
      }

      expect(call).toThrow(Error);
      expect(call).toThrow("Appointment slot already taken");
    });
  });
});