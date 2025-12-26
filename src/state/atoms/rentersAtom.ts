import { atomWithQuery } from "jotai-tanstack-query";
import agent from "src/api/agent";
import { Renter } from "prisma/types/renter";
import { currentLandlordAtom } from "./currentLandlordAtom";

export const rentersAtom = atomWithQuery<Renter[]>((get) => {
  const landlordRes = get(currentLandlordAtom);
  const landlord = landlordRes?.data;

  return {
    queryKey: ["renters", landlord?.id],
    enabled: Boolean(landlord?.id),
    queryFn: async () => {
      if (!landlord?.id) return [];
      const response = await agent.renters.list(landlord.id);
      return (response ?? []).filter((renter) => renter.state === 1);
    },
  };
});
