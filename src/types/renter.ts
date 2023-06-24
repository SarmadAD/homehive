export interface Renter {
  id: string;
  createdAt: number;
  name: string;
  status: RenterPaidStatus;
  email: string;
  image: string;
}

export type RenterPaidStatus = "PAID" | "NOTPAID" | "INARREARS";
