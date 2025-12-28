import { atomWithMutation, queryClientAtom } from "jotai-tanstack-query";
import agent from "src/api/agent";
import { currentLandlordAtom } from "./currentLandlordAtom";

export const deleteRentalAgreementAtom = atomWithMutation((get) => {
  const landlord = get(currentLandlordAtom)?.data;

  return {
    mutationFn: async (rentalAgreementId: string) => {
      return agent.rentalAgreements.delete(rentalAgreementId);
    },
    onSuccess: async () => {
      const qc = get(queryClientAtom);
      await qc.invalidateQueries({ queryKey: ["rentalAgreements", landlord?.id] });
      await qc.invalidateQueries({ queryKey: ["currentLandlord", landlord?.id] });
    },
  };
});
