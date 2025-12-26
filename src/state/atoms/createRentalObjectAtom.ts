import { atomWithMutation, queryClientAtom } from "jotai-tanstack-query";
import agent from "src/api/agent";
import { RentalObject } from "prisma/types/objects";
import { currentLandlordAtom } from "./currentLandlordAtom";

export const createRentalObjectAtom = atomWithMutation<RentalObject, RentalObject, Error>((get) => {
  const landlord = get(currentLandlordAtom)?.data;

  return {
    mutationFn: async (newObject) => {
      return agent.objects.create(newObject);
    },

    onSuccess: () => {
      const qc = get(queryClientAtom);

      qc.invalidateQueries({
        queryKey: ["rentalObjects", landlord?.id],
      });

      qc.invalidateQueries({
        queryKey: ["currentLandlord", landlord?.id],
      });
    },
  };
});
