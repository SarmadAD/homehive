import { atom, selector } from "recoil";
import { currentUserAtom } from "./currentUserAtom";
import agent from "src/api/agent";
import { Renter } from "@prisma/client";

export const rentersAtom = atom<Renter[]>({
  key: "rentersAtom",
  default: selector({
    key: "rentersAtom/renters",
    get: async ({ get }) => {
      const landlord = get(currentUserAtom);
      if (landlord.id) {
        const response = await agent.renters.list(landlord.id);
        return response;
      }
      return [];
    },
  }),
});
