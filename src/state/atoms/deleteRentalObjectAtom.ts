import { atomWithMutation, queryClientAtom } from "jotai-tanstack-query";
import agent from "src/api/agent";
import { currentLandlordAtom } from "./currentLandlordAtom";

export const deleteRentalObjectAtom = atomWithMutation((get) => {
  const landlord = get(currentLandlordAtom)?.data;

  return {
    mutationFn: async (objectId: string) => {
      return agent.objects.delete(objectId);
    },
    onSuccess: async () => {
      const qc = get(queryClientAtom);
      await qc.invalidateQueries({ queryKey: ["rentalObjects", landlord?.id] });
      await qc.invalidateQueries({ queryKey: ["currentLandlord", landlord?.id] });
    },
  };
});
