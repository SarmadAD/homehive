import { atom, selector } from "recoil";
import { currentUserAtom } from "./currentUserAtom";
import agent from "src/api/agent";
import { RentPayment } from "@prisma/client";

export const rentPaymentsAtom = atom<RentPayment[]>({
  key: "rentPaymentsAtom",
  default: selector({
    key: "rentPaymentsAtom/rentPayments",
    get: async ({ get }) => {
      const landlord = get(currentUserAtom);
      if (landlord.id) {
        const response = await agent.rentPayments.list(landlord.id);
        return response;
      }
      return [];
    },
  }),
});
