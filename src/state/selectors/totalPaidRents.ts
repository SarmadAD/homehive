import { selector } from "recoil";
import { rentersAtom } from "../atoms/rentersAtom";

export const totalPaidRents = selector({
  key: "totalPaidRents",
  get: ({ get }) => {
    const renters = get(rentersAtom);
    if (renters.length > 0) {
      const lengthPaidRents = renters?.filter((renter) => renter.status === "PAID").length;
      return lengthPaidRents;
    }
    return undefined;
  },
});
