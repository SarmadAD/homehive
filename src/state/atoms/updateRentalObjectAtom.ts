import { atomWithMutation, queryClientAtom } from "jotai-tanstack-query";
import agent from "src/api/agent";
import { RentalObject } from "prisma/types/objects";

export const updateRentalObjectAtom = atomWithMutation<RentalObject, RentalObject, Error>((get) => {
  return {
    mutationFn: async (object) => {
      return agent.objects.update(object);
    },

    onSuccess: (updated) => {
      const qc = get(queryClientAtom);

      qc.setQueryData(["rentalObject", updated.id], updated);
      qc.invalidateQueries({ queryKey: ["rentalObjects"] });
    },
  };
});
