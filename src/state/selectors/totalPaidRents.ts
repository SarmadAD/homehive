import { selector } from "recoil";
import { rentalObjectsAtom } from "../atoms/rentalObjectsAtom";

export const totalPaidRents = selector({
  key: "totalPaidRents",
  get: ({ get }) => {
    const rentalObjects = get(rentalObjectsAtom);
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    let totalPaidRentCount = 0;

    rentalObjects.forEach((rentalObject) => {
      if (rentalObject.rentPayment.length > 0) {
        rentalObject.rentPayment.forEach((rentPayment) => {
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
    });

    return totalPaidRentCount;
  },
});
