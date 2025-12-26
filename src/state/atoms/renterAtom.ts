import { atomWithQuery } from "jotai-tanstack-query";
import agent from "src/api/agent";
import { Renter, renterDefault } from "prisma/types/renter";
import { currentUserIdAtom } from "./currentUserIdAtom";

export const renterAtom = atomWithQuery<Renter>((get) => {
  const id = get(currentUserIdAtom);

  return {
    queryKey: ["renter", "me", id],
    enabled: Boolean(id),
    queryFn: async () => {
      if (!id) return renterDefault;
      const response = await agent.renter.details(id);
      return response ?? renterDefault;
    },
  };
});
