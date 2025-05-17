import { atom, selector } from "recoil";
import agent from "src/api/agent";
import { RentalObject } from "prisma/types/objects";
import { currentLandlordAtom } from "./currentLandlordAtom";

export const rentalObjectsAtom = atom<RentalObject[]>({
  key: "rentalObjectsAtom",
  default: selector({
    key: "rentalObjectsAtom/rentalObjects",
    get: async ({ get }) => {
      const user = get(currentLandlordAtom);
      if (user.id) {
        const response = await agent.objects.list(user.id);
        if (response.length > 0) return response;
        else return [];
      }
      return [];
    },
  }),
});
