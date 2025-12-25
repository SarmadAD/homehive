import { atomWithQuery } from "jotai-tanstack-query";
import agent from "src/api/agent";
import { RentPayment } from "prisma/types/rentPayment";
import { currentLandlordAtom } from "./currentLandlordAtom";

export const rentPaymentsAtom = atomWithQuery<RentPayment[]>((get) => {
  const landlordResult = get(currentLandlordAtom);
  const landlord = landlordResult?.data;

  return {
    queryKey: ["rentPayments", landlord?.id],
    queryFn: async () => {
      if (landlord?.id) {
        const response = await agent.rentPayments.list(landlord.id);
        return response;
      }
      return [];
    },
    enabled: !!landlord?.id,
  };
});
