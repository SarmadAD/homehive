import { atomWithQuery } from "jotai-tanstack-query";
import agent from "src/api/agent";
import { RentalAgreement } from "prisma/types/rentalAgreement";
import { selectedRentalAgreementIdAtom } from "./selectedRentalAgreementIdAtom";

export const rentalAgreementAtom = atomWithQuery<RentalAgreement>((get) => {
  const rentalAgreementId = get(selectedRentalAgreementIdAtom);

  return {
    queryKey: ["rentalAgreement", rentalAgreementId],
    enabled: Boolean(rentalAgreementId),
    queryFn: async () => {
      if (!rentalAgreementId) throw new Error("Missing rentalAgreementId");
      return agent.rentalAgreements.details(rentalAgreementId);
    },
  };
});
