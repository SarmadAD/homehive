export interface Renter {
  id: string;
  createdAt: number;
  name: string;
  status: RenterPaidStatus;
  address?: string;
  city?: string;
  email: string;
  image: string;
}

export type RenterPaidStatus = "paid" | "notPaid";
