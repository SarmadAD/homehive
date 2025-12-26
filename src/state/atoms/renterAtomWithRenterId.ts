import { atomWithQuery } from "jotai-tanstack-query";
import agent from "src/api/agent";
import { Renter, renterDefault } from "prisma/types/renter";
import { selectedRenterIdAtom } from "./selectedRenterIdAtom";

export const renterAtomWithRenterId = atomWithQuery<Renter>((get) => {
  const id = get(selectedRenterIdAtom);

  return {
    queryKey: ["renter", "byId", id],
    enabled: Boolean(id),
    queryFn: async () => {
      if (!id) return renterDefault;
      const response = await agent.renters.details(id);
      return response ?? renterDefault;
    },
  };
});
