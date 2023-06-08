import { useMemo } from "react";
import { RepairRequest } from "src/types/repairRequest";

export const useRepairRequestsIds = (repairRequests: RepairRequest[] = []) => {
  return useMemo(() => {
    return repairRequests.map((repairRequest) => repairRequest.id);
  }, [repairRequests]);
};
