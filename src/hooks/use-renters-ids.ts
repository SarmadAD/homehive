import { Renter } from "@prisma/client";
import { useMemo } from "react";

export const useRentersIds = (renters: Renter[] = []) => {
  return useMemo(() => {
    return renters.length > 0 ? renters.map((renter) => renter.id) : [];
  }, [renters]);
};
