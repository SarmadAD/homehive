import { atomWithMutation, queryClientAtom } from "jotai-tanstack-query";
import agent from "src/api/agent";
import { currentLandlordAtom } from "./currentLandlordAtom";

export const deleteRenterAtom = atomWithMutation((get) => {
  const landlord = get(currentLandlordAtom)?.data;

  return {
    mutationFn: (renterId: string) => agent.renters.delete(renterId),

    onSuccess: () => {
      const qc = get(queryClientAtom);
      qc.invalidateQueries({ queryKey: ["renters", landlord?.id] });
      qc.invalidateQueries({ queryKey: ["currentLandlord", landlord?.id] });
    },
  };
});
