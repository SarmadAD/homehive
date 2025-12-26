import { atom } from "jotai";
import { rentPaymentsAtom } from "./rentPayments";

export const totalPaidRentsAtom = atom((get) => {
  const { data, isLoading, isError } = get(rentPaymentsAtom);

  if (isLoading) {
    return {
      value: 0,
      isLoading: true,
      isError: false,
    };
  }

  if (isError || !data) {
    return {
      value: 0,
      isLoading: false,
      isError: true,
    };
  }

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const value = data.filter((rentPayment) => {
    if (rentPayment.status !== "PAID" || !rentPayment.paymentDate) return false;
    const d = new Date(rentPayment.paymentDate);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  return {
    value,
    isLoading: false,
    isError: false,
  };
});
