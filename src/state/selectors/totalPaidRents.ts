import { selector } from "recoil";
import { rentPaymentsAtom } from "../atoms/rentPayments";

export const totalPaidRents = selector({
  key: "totalPaidRents",
  get: ({ get }) => {
    const rentPayments = get(rentPaymentsAtom);
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
  },
});
