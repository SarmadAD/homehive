import { atomWithMutation, queryClientAtom } from "jotai-tanstack-query";
import agent from "src/api/agent";
import { currentLandlordAtom } from "./currentLandlordAtom";
import { RentPayment } from "prisma/types/rentPayment";

export const markRentPaymentPaidAtom = atomWithMutation<
  {}, // Response (oder was eure API zurückgibt)
  string, // paymentId
  Error
>((get) => {
  const landlord = get(currentLandlordAtom)?.data;

  return {
    mutationFn: async (paymentId: string) => {
      return agent.rentPayments.update(paymentId);
    },
    onSuccess: () => {
      const qc = get(queryClientAtom);
      qc.invalidateQueries({ queryKey: ["rentPayments", landlord?.id] });
    },
  };
});
