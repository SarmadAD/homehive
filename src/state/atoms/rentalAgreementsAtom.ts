import { atom, selector } from "recoil";
import agent from "src/api/agent";
import { currentLandlordAtom } from "./currentLandlordAtom";
import { RentalAgreement } from "prisma/types/rentalAgreement";

export const rentalAgreementsAtom = atom<RentalAgreement[]>({
  key: "rentalAgreementsAtom",
  default: selector({
    key: "rentalAgreementsAtom/rentalAgreements",
    get: async ({ get }) => {
      const landlord = get(currentLandlordAtom);
      if (landlord.id) {
        const response = await agent.rentalAgreements.list(landlord.id);
        return response;
      }
      return [];
    },
  }),
});
