import { atom, selector } from "recoil";
import { currentUserAtom } from "./currentUserAtom";
import agent from "src/api/agent";
import { RentalObject } from "prisma/types/objects";

export const rentalObjectsAtom = atom<RentalObject[]>({
  key: "rentalObjectsAtom",
  default: selector({
    key: "rentalObjectsAtom/rentalObjects",
    get: async ({ get }) => {
      const user = get(currentUserAtom);
      if (user.id) {
        const response = await agent.objects.list(user.id);
        if (response.length > 0) return response;
        else return [];
      }
      return [];
    },
  }),
});
