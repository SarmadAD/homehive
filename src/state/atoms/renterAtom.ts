import { atom, selector } from "recoil";
import agent from "src/api/agent";
import { Renter, renterDefault } from "prisma/types/renter";
import { currentUserIdAtom } from "./currentUserIdAtom";
import { selectedRenterIdAtom } from "./selectedRenterIdAtom";

export const renterAtom = atom<Renter>({
  key: "renterAtom",
  default: selector({
    key: "renterAtom/renter",
    get: async ({ get }) => {
      const id = get(currentUserIdAtom);
      if (id) {
        const response = await agent.renter.details(id);
        return response;
      }
      return renterDefault;
    },
  }),
});

export const renterAtomWithRenterId = atom<Renter>({
  key: "renterAtom",
  default: selector({
    key: "renterAtom/renter",
    get: async ({ get }) => {
      const id = get(selectedRenterIdAtom);
      if (id) {
        const response = await agent.renters.details(id);
        return response;
      }
      return renterDefault;
    },
  }),
});
