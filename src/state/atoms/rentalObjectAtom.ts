import { atom } from "recoil";
import { RentalObject } from "src/types/object";

export const rentalObjectAtom = atom<RentalObject>({
  key: "rentalObject",
  default: {} as RentalObject,
});
