import {addDays, getDay, isBefore, nextDay} from "date-fns";

export class Utils {
    getWorkingDaysInTimeSpan(fromDate: Date, toDate: Date, workDayOfWeek: Day) {
        let workDays: Date[] = [];

        if (getDay(fromDate) === workDayOfWeek) {
            workDays.push(fromDate);
        }
        const nextStartDay = nextDay(fromDate, workDayOfWeek);
        if (!workDays.length && isBefore(nextStartDay, toDate)) {
            workDays.push(nextStartDay);
        }

        if (workDays.length) {
            let currentDay = workDays[workDays.length - 1];
            while (isBefore(addDays(currentDay, 7), toDate)) {
                workDays.push(addDays(currentDay, 7));
                currentDay = addDays(currentDay, 7);
            }
        }

        return workDays;
    }
}