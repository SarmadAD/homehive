import { atom, selector } from "recoil";
import { currentUserAtom } from "./currentUserAtom";
import agent from "src/api/agent";
import { RentalObject } from "prisma/types/objects";

export const rentalObjectsAtom = atom<RentalObject[]>({
  key: "rentalObjectsAtom",
  default: selector({
    key: "rentalObjectsAtom/rentalObjects",
    get: async ({ get }) => {
      const landlord = get(currentUserAtom);
      if (landlord.id) {
        const response = await agent.objects.list(landlord.id);
        return response;
      }
      return [];
    },
  }),
});
