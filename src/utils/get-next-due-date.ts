import { DueDateOfRent } from "@prisma/client";

export default function getNextDueDateFromState(dueDateState: string, dueDate: Date) {
  const nextMonth = new Date(dueDate.getFullYear(), dueDate.getMonth() + 1, 1);
  if (dueDateState === DueDateOfRent.MIDDLEMONTH) {
    nextMonth.setDate(15);
  } else if (dueDateState === DueDateOfRent.ENDMONTH) {
    nextMonth.setMonth(nextMonth.getMonth() + 1, 0);
  } else if (dueDateState === DueDateOfRent.FIRSTMONTH) {
    nextMonth.setDate(1);
  } else {
    nextMonth.setDate(1);
  }
  return nextMonth;
}
