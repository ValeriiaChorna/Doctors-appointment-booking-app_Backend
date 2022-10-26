import { Appointment } from "@/entities/Appointment";
import { Availability } from "@/entities/Availability";
import { Doctor } from "@/entities/Doctor";
import createMockRepo from "@test/mocks/mockRepo";
import { addDays, nextMonday, setHours, setMinutes } from "date-fns";
import Container from "typedi";
import { ConnectionManager, Repository } from "typeorm";
import { DoctorService } from "./DoctorService";

const mockRepo: Partial<Repository<Doctor>> = {};

describe('DoctorService', () => {
  beforeAll(() => {
    Container.set(ConnectionManager, createMockRepo(mockRepo));
  });

  describe('slots query', () => {
    it('should return all slots for doctor', async () => {
      const doctor = new Doctor();
      doctor.availability = [{
        dayOfWeek: 1, // Monday
        startTimeUtc: '09:00',
        endTimeUtc: '17:00',
      }, {
        dayOfWeek: 2, // Tuesday
        startTimeUtc: '09:00',
        endTimeUtc: '12:00',
      }, {
        dayOfWeek: 2, // Wednesday
        startTimeUtc: '14:00',
        endTimeUtc: '17:00', 
      }].map((a) => {
        const availability = new Availability();
        availability.dayOfWeek = a.dayOfWeek;
        availability.startTimeUtc = a.startTimeUtc;
        availability.endTimeUtc = a.endTimeUtc;
        return availability;
      });

      mockRepo.find = jest.fn(() => {
        return Promise.resolve([doctor]);
      });

      const sut = Container.get(DoctorService);

      // from 9am next monday
      const from = setMinutes(setHours(addDays(nextMonday(new Date()), 1), 9), 0);
      const to = addDays(from, 7);
      const slots = await sut.getAvailableSlots(from, to);
      
      const slotsOnMonday = ((17 - 9) * 60) / 15;
      const slotsOnTuesdayMorning = ((12-9)*60) / 15;
      const slotsOnTuesdayAfternoon = ((17-14)*60) / 15;
      const totalSlots = slotsOnMonday + slotsOnTuesdayAfternoon + slotsOnTuesdayMorning;

      expect(slots.length).toBe(totalSlots);
    });

    it('should not return slot if appointment exists for doctor', async () => {
      const doctor = new Doctor();
      doctor.availability = [{
        dayOfWeek: 1,
        startTimeUtc: '09:00',
        endTimeUtc: '17:00',
      }, {
        dayOfWeek: 2,
        startTimeUtc: '09:00',
        endTimeUtc: '12:00',
      }, {
        dayOfWeek: 2,
        startTimeUtc: '14:00',
        endTimeUtc: '17:00', 
      }].map((a) => {
        const availability = new Availability();
        availability.dayOfWeek = a.dayOfWeek;
        availability.startTimeUtc = a.startTimeUtc;
        availability.endTimeUtc = a.endTimeUtc;
        return availability;
      });
      
      const appointment = new Appointment()

      // set appointment start time to next monday at 2pm
      const startTime = setMinutes(setHours(addDays(nextMonday(new Date()), 1), 14), 0);
      appointment.startTime = startTime;
      appointment.durationMinutes = 15;
      doctor.appointments = [ 
        appointment,
      ]

      mockRepo.find = jest.fn(() => {
        return Promise.resolve([doctor]);
      });

      const sut = Container.get(DoctorService);

      // from 9am next monday
      const from = setMinutes(setHours(addDays(nextMonday(new Date()), 1), 9), 0);
      const to = addDays(from, 7);
      const slots = await sut.getAvailableSlots(from, to);
      
      const slotsOnMonday = ((17 - 9) * 60) / 15;
      const slotsOnTuesdayMorning = ((12-9)*60) / 15;
      const slotsOnTuesdayAfternoon = ((17-14)*60) / 15;
      const totalSlots = slotsOnMonday + slotsOnTuesdayAfternoon + slotsOnTuesdayMorning;

      // expect there to be 1 less slot
      expect(slots.length).toBe(totalSlots - 1);
    });
  })
})