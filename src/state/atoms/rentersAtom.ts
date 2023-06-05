import { atom } from "recoil";
import { Renter } from "src/types/renter";

export const rentersAtom = atom<Renter[]>({
  key: "rentersState",
  default: [],
});
