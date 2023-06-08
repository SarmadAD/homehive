import { RentalObjectInfo } from "./RentalObjectInfo";
import { Renter } from "./renter";

export interface RentalObject {
  id: string;
  createdAt: number;
  name: string;
  image: string;
  status: RentalObjectStatus;
  address: string;
  houseNr: number;
  additionalHouseDetails?: string;
  city: string;
  postalCode: string;
  areaSize: number;
  renter: Renter[];
  rentInfo: RentalObjectInfo;
  repairRequestsIds: string[];
}

export type RentalObjectStatus = "inhabited" | "uninhabited";
