import { atom, selector } from "recoil";
import { selectedRentalObjectIdAtom } from "./selectedRentalObjectIdAtom";
import agent from "src/api/agent";
import { RentalObject, rentalObjectDefault } from "prisma/types/objects";

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
      return rentalObjectDefault;
    },
  }),
});
