import { useMemo } from "react";
import { Renter } from "src/types/renter";

export const useRentersIds = (renters: Renter[] = []) => {
  return useMemo(() => {
    return renters.map((renter) => renter.id);
  }, [renters]);
};
