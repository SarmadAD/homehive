import { atom, selector } from "recoil";
import agent from "src/api/agent";
import { selectedRenterIdAtom } from "./selectedRenterIdAtom";
import { Renter } from "@prisma/client";

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
