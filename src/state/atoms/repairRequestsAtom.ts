import { atom } from "recoil";
import { Renter } from "src/types/renter";
import { RepairRequest } from "src/types/repairRequest";

export const repairRequestsAtom = atom<RepairRequest[]>({
  key: "repairRequestsAtom",
  default: [],
});
