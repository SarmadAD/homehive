import { Renter } from "@prisma/client";
import { useMemo } from "react";

export const useRentersIds = (renters: Renter[] = []) => {
  return useMemo(() => {
    return renters.map((renter) => renter.id);
  }, [renters]);
};
