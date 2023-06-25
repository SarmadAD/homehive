import { atom, selector } from "recoil";
import { renterApi } from "src/api/renter";
import { Renter } from "src/types/renter";
import { currentLandlordAtom } from "./currentLandlordAtom";
import agent from "src/api/agent";

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
