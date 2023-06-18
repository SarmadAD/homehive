import { Landlord } from "@prisma/client";
import { atom } from "recoil";

export const currentLandlordAtom = atom<Landlord>({
  key: "currentLandlordAtom",
  default: { firebaseUserId: "", id: "" } as Landlord,
});
