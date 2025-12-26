import { atomWithQuery } from "jotai-tanstack-query";
import agent from "src/api/agent";
import { defaultLandlord, Landlord } from "prisma/types/landlord";
import { currentUserIdAtom } from "./currentUserIdAtom";

export const currentLandlordAtom = atomWithQuery<Landlord>((get) => {
  const authenticatedUserId = get(currentUserIdAtom);
  return {
    queryKey: ["currentLandlord", authenticatedUserId],
    queryFn: async () => {
      if (authenticatedUserId) {
        const landlord = await agent.landlord.details(authenticatedUserId);
        return landlord;
      }
      return defaultLandlord;
    },
    enabled: !!authenticatedUserId,
  };
});
