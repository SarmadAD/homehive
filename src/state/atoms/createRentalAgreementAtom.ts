import { atomWithMutation, queryClientAtom } from "jotai-tanstack-query";
import agent from "src/api/agent";
import { RentalAgreement } from "prisma/types/rentalAgreement";
import { currentLandlordAtom } from "./currentLandlordAtom";

type CreateRentalAgreementVars = {
  agreement: RentalAgreement;
  landlordId: string;
};

export const createRentalAgreementAtom = atomWithMutation<
  RentalAgreement, // Response
  CreateRentalAgreementVars, // Variables
  Error // Error
>((get) => {
  const landlord = get(currentLandlordAtom)?.data;

  return {
    mutationFn: async ({ agreement, landlordId }) => {
      return agent.rentalAgreements.create(agreement, landlordId);
    },

    onSuccess: (_created, vars) => {
      const qc = get(queryClientAtom);

      qc.invalidateQueries({
        queryKey: ["rentalAgreements", vars.landlordId],
      });

      qc.invalidateQueries({
        queryKey: ["currentLandlord", vars.landlordId],
      });
    },
  };
});
