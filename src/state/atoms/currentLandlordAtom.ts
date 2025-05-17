import { atom, selector } from "recoil";
import agent from "src/api/agent";
import { defaultLandlord, Landlord } from "prisma/types/landlord";
import { currentUserIdAtom } from "./currentUserIdAtom";

export const currentLandlordAtom = atom<Landlord>({
  key: "currentLandlordAtom",
  default: selector({
    key: "currentLandlordAtom/landlord",
    get: async ({ get }) => {
      const authenticatedUserId = get(currentUserIdAtom);
      if (authenticatedUserId) {
        const landlord = await agent.landlord.details(authenticatedUserId);
        return landlord;
      }
      return defaultLandlord;
    },
  }),
});
