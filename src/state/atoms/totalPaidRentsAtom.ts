import { atom } from "jotai";
import { rentPaymentsAtom } from "./rentPayments";

export const totalPaidRentsAtom = atom((get) => {
  const rentPaymentsResults = get(rentPaymentsAtom);
  const rentPayments = rentPaymentsResults?.data || [];
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  let totalPaidRentCount = 0;

  if (rentPayments.length > 0) {
    rentPayments.forEach((rentPayment) => {
      if (rentPayment.status === "PAID" && rentPayment.paymentDate) {
        const paymentDate = new Date(rentPayment.paymentDate);
        const paymentMonth = paymentDate.getMonth();
        const paymentYear = paymentDate.getFullYear();

        if (paymentMonth === currentMonth && paymentYear === currentYear) {
          totalPaidRentCount++;
        }
      }
    });
  }

  return totalPaidRentCount;
});
