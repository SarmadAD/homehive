import { atomWithMutation, queryClientAtom } from "jotai-tanstack-query";
import agent from "src/api/agent";
import { Renter } from "prisma/types/renter";
import { currentLandlordAtom } from "./currentLandlordAtom";

type CreateRenterVars = {
  renter: Renter;
  landlordId: string;
};

export const createRenterAtom = atomWithMutation<
  Renter, // Response
  CreateRenterVars, // Variables
  Error // Error
>((get) => {
  const landlord = get(currentLandlordAtom)?.data;

  return {
    mutationFn: async ({ renter, landlordId }) => {
      return agent.renters.create(renter, landlordId);
    },

    onSuccess: (_created, vars) => {
      const qc = get(queryClientAtom);

      qc.invalidateQueries({ queryKey: ["renters", vars.landlordId] });
      qc.invalidateQueries({ queryKey: ["currentLandlord", vars.landlordId] });
    },
  };
});
