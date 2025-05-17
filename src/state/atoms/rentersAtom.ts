import { atom, selector } from "recoil";
import agent from "src/api/agent";
import { Renter } from "prisma/types/renter";
import { currentLandlordAtom } from "./currentLandlordAtom";

export const rentersAtom = atom<Renter[]>({
  key: "rentersAtom",
  default: selector({
    key: "rentersAtom/renters",
    get: async ({ get }) => {
      const landlord = get(currentLandlordAtom);
      if (landlord.id) {
        const response = await agent.renters.list(landlord.id);
        return response;
      }
      return [];
    },
  }),
});
