import { RepairRequest } from "@prisma/client";
import { useMemo } from "react";

export const useRepairRequestsIds = (repairRequests: RepairRequest[] = []) => {
  return useMemo(() => {
    return repairRequests.map((repairRequest) => repairRequest.id);
  }, [repairRequests]);
};
