import { atomWithQuery } from "jotai-tanstack-query";
import agent from "src/api/agent";
import { selectedRentalObjectIdAtom } from "./selectedRentalObjectIdAtom";
import { RentalObject } from "prisma/types/objects";

export const rentalObjectAtom = atomWithQuery<RentalObject>((get) => {
  const objectId = get(selectedRentalObjectIdAtom);

  return {
    queryKey: ["rentalObject", objectId],
    enabled: Boolean(objectId),
    queryFn: async () => {
      if (!objectId) throw new Error("Missing objectId");
      return agent.objects.details(objectId);
    },
  };
});
