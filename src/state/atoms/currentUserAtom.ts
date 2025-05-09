import { Landlord } from "prisma/types/landlord";
import { Renter } from "prisma/types/renter";
import { atom } from "recoil";

export const currentUserAtom = atom<Landlord | Renter>({
  key: "currentUserAtom",
  default: { authenticatedUserId: "", id: "" } as Landlord | Renter,
});
