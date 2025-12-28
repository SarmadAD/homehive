import { atomWithMutation, queryClientAtom } from "jotai-tanstack-query";
import agent from "src/api/agent";
import { RentalAgreement } from "prisma/types/rentalAgreement";

export const updateRentalAgreementAtom = atomWithMutation<RentalAgreement, RentalAgreement, Error>((get) => {
  return {
    mutationFn: async (object) => {
      return agent.rentalAgreements.update(object);
    },

    onSuccess: (updated) => {
      const qc = get(queryClientAtom);

      qc.setQueryData(["rentalAgreement", updated.id], updated);
      qc.invalidateQueries({ queryKey: ["rentalAgreements"] });
    },
  };
});
