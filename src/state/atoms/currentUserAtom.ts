import { Landlord } from "@prisma/client";
import { Renter } from "prisma/types/renter";
import { atom } from "recoil";

export const currentUserAtom = atom<Landlord | Renter>({
  key: "currentUserAtom",
  default: { firebaseUserId: "", id: "" } as Landlord | Renter,
});
