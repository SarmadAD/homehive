import { atom, selector } from "recoil";
import { RentalObject } from "src/types/object";
import { selectedRentalObjectIdAtom } from "./selectedRentalObjectIdAtom";
import agent from "src/api/agent";

export const rentalObjectAtom = atom<RentalObject>({
  key: "rentalObjectAtom",
  default: selector({
    key: "rentalObjectAtom/rentalObject",
    get: async ({ get }) => {
      const id = get(selectedRentalObjectIdAtom);
      if (id) {
        const response = await agent.objects.details(id);
        return response;
      }
    },
  }),
});
