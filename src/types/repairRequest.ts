import { Renter } from "./renter";

export interface RepairRequest {
  id: string;
  createdAt: number;
  name: string;
  status: RepairRequestStatus;
  comment?: string;
  renter: Renter;
}

export type RepairRequestStatus = "REQUESTED" | "REJECTED" | "DONE" | "CANCELD" | "INPROGRESS";
