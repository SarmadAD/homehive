import { atom, selector, useRecoilValue } from "recoil";
import { currentLandlordAtom } from "./currentLandlordAtom";
import agent from "src/api/agent";
import { RentalObject } from "src/types/object";

export const rentalObjectsAtom = atom<RentalObject[]>({
  key: "rentalObjectsAtom",
  default: selector({
    key: "rentalObjectsAtom/rentalObjects",
    get: async ({ get }) => {
      const landlord = get(currentLandlordAtom);
      if (landlord.id) {
        const response = await agent.objects.list(landlord.id);
        return response;
      }
      return [];
    },
  }),
});
