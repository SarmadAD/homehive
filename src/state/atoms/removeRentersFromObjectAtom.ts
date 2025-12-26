import { atomWithMutation, queryClientAtom } from "jotai-tanstack-query";
import agent from "src/api/agent";

export const removeRentersFromObjectAtom = atomWithMutation((get) => {
  return {
    mutationFn: async (params: { renterIds: string[]; objectId: string }) => {
      const { renterIds, objectId } = params;
      await agent.renter.removeRentalObjectFromRenter(renterIds, objectId);
      return true;
    },
    onSuccess: (_data, vars) => {
      const qc = get(queryClientAtom);
      qc.invalidateQueries({ queryKey: ["rentalObject", vars.objectId] });
      qc.invalidateQueries({ queryKey: ["rentalObjects"] });
    },
  };
});
