import { atom } from "recoil";
import { RentalObject } from "src/types/object";

export const rentalObjectsAtom = atom<RentalObject[]>({
  key: "rentalObjectsAtom",
  default: [],
});
