import { atomWithQuery } from "jotai-tanstack-query";
import agent from "src/api/agent";
import { currentLandlordAtom } from "./currentLandlordAtom";
import { RentalAgreement } from "prisma/types/rentalAgreement";

export const rentalAgreementsAtom = atomWithQuery<RentalAgreement[]>((get) => {
  const landlordRes = get(currentLandlordAtom);
  const landlord = landlordRes?.data;

  return {
    queryKey: ["rentalAgreements", landlord?.id],
    enabled: Boolean(landlord?.id),
    queryFn: async () => {
      if (!landlord?.id) return [];
      return agent.rentalAgreements.list(landlord.id);
    },
  };
});
