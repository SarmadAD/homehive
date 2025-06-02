import { atom, selector } from "recoil";
import agent from "src/api/agent";
import { RentPayment } from "prisma/types/rentPayment";
import { currentLandlordAtom } from "./currentLandlordAtom";

export const rentPaymentsAtom = atom<RentPayment[]>({
  key: "rentPaymentsAtom",
  default: selector({
    key: "rentPaymentsAtom/rentPayments",
    get: async ({ get }) => {
      const landlord = get(currentLandlordAtom);
      if (landlord.id) {
        const response = await agent.rentPayments.list(landlord.id);
        return response;
      }
      return [];
    },
  }),
});
