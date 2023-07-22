import { DueDateOfRent } from "@prisma/client";

export const getDueDateOfRent = (dueDateState: DueDateOfRent) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  switch (dueDateState) {
    case "FIRSTMONTH":
      return new Date(currentYear, currentMonth, 1);

    case "MIDDLEMONTH":
      return new Date(currentYear, currentMonth, 15);

    case "ENDMONTH":
      return new Date(currentYear, currentMonth, 27);

    default:
      throw new Error("Ungültiger Enum-Wert");
  }
};
