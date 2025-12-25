import { atomWithQuery } from "jotai-tanstack-query";
import agent from "src/api/agent";
import { RentalObject } from "prisma/types/objects";
import { currentLandlordAtom } from "./currentLandlordAtom";

export const rentalObjectsAtom = atomWithQuery<RentalObject[]>((get) => {
  const userRes = get(currentLandlordAtom);
  const user = userRes?.data;

  return {
    queryKey: ["rentalObjects", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await agent.objects.list(user.id);
      return response ?? [];
    },
  };
});
