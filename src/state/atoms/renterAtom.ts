import { atom, selector } from "recoil";
import { RentalObject } from "src/types/object";
import agent from "src/api/agent";
import { selectedRenterIdAtom } from "./selectedRenterIdAtom";
import { Renter } from "src/types/renter";

export const renterAtom = atom<Renter>({
  key: "renterAtom",
  default: selector({
    key: "renterAtom/renter",
    get: async ({ get }) => {
      const id = get(selectedRenterIdAtom);
      if (id) {
        const response = await agent.renters.details(id);
        return response;
      }
    },
  }),
});
