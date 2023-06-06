import { atom, selector } from "recoil";
import { objectsApi } from "src/api/objects";
import { Renter } from "src/types/renter";
import { RepairRequest } from "src/types/repairRequest";

export const repairRequestsAtom = atom<RepairRequest[]>({
  key: "repairRequestsAtom",
  default: selector({
    key: "repairRequestsAtom/repairRequests",
    get: async () => {
      const response = await objectsApi.getAllRepairRequests();
      return response;
    },
  }),
});
